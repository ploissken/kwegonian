const dictionary = require('./kwego-dictionary.json')

module.exports = {
  // makes a readable version of
  parseToHuman: function (array) {
    return array.join().replace(/,/g, ', ')
  },

  // verify roman string inconsistence
  validateRoman: function (translatedKwego) {
    // TODO: there are still many inconsistences to be catpured here
    const inconsistences = [ 'IIII', 'VV', 'XXXX', 'LL', 'CCCC', 'DD' ]

    const kwegoAsRoman = translatedKwego.map(i => i.roman).join().replace(/,/g, '')

    const inconsistenceErrors = inconsistences.map(inc => {
      return kwegoAsRoman.includes(inc) ? inc : false
    }).filter(Boolean)

    if (inconsistenceErrors.length) {
      return {
        status: 'error',
        message: `roman inconsistence(s) found: "${this.parseToHuman(inconsistenceErrors)}"`
      }
    }

    return {
      status: 'success',
      data: kwegoAsRoman
    }
  },

  // tries to translate a kwego input
  translateKwego: function (kwegoInput) {
    if(!kwegoInput) {
      return {
        status: 'error',
        message: `no kwego received`
      }
    }

    const kwegoAlgarisms = kwegoInput.replace(/ /g, ',').split(',')
    const translated = []
    const translationErrors = []

    kwegoAlgarisms.forEach(algarism => {
      const translatedChar = dictionary[algarism.toLowerCase()]

      if (!translatedChar) {
        // save occurences of unknown algarisms
        translationErrors.push(algarism)
      } else {
        translated.push(translatedChar)
      }
    })

    // abort if any translation problem occured
    if(translationErrors.length) {
      return {
        status: 'error',
        message: `unable to decode "${this.parseToHuman(translationErrors)}"`
      }
    }

    // abort if roman version is inconsistent
    const romanValidation = this.validateRoman(translated)
    if(romanValidation.status === `error`) {
      return romanValidation
    }

    // return the translated kwego array
    return {
      status: 'success',
      data: translated,
      kwegoToHuman: kwegoAlgarisms.join().replace(/,/g, ' '),
      kwegoAsRoman: romanValidation.data,
      kwegoAsDecimal: this.romanToDecimals(translated)
    }
  },

  // converts to decimal an array of roman algarisms, represented as decimals
  // (X = 10, I = 1, V = 5 ...)
  romanToDecimals: function (translated) {
    const kwegoAsDecimal = translated.map(i => i.decimal)
    let comparingNumber = kwegoAsDecimal.shift()

    // if we have a single algarism, the job is done
    if (!kwegoAsDecimal.length) return comparingNumber

    let sum = 0
    let nextNumber = 0
    let numbersToCompare = kwegoAsDecimal.length

    for (let i = 0; i < numbersToCompare; i++) {
    	nextNumber = kwegoAsDecimal[0]

    	if (comparingNumber >= nextNumber) {
    		// first number is greater, sum it up and keep going
    		sum += comparingNumber
    		comparingNumber = kwegoAsDecimal.shift()

        // if the next comparingNumber is the last algarism,
        // we add it to the sum
    		if ((i + 1) == numbersToCompare) {
    			sum += comparingNumber
    		}
    	} else {
        // when nextNumber is greater than comparingNumber,
        // its a subtraction operation. we sum the difference
    		sum += (nextNumber - comparingNumber)

    		// if there's just one more number left, add it to the total and we are done
    		if ((i + 2) == numbersToCompare && numbersToCompare == 1) {
    			comparingNumber = kwegoAsDecimal.shift()
    			sum += comparingNumber
    		}

        // if there's more than one number left,
        // we start again
    		if ((i + 2) < numbersToCompare) {
    			comparingNumber = kwegoAsDecimal.shift()
    		}

        // and since we joined two algarisms in one,
    		// we add one to the counter
    		i++
    	}
    }

    return sum
  }
}
