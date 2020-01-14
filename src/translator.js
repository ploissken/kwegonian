const dictionary = require('./kwego-dictionary.json')

module.exports = {
  // makes a readable version of
  parseToHuman: function (array) {
    return array.join().replace(/,/g, ', ')
  },

  // verify and warn roman string for inconsistences
  // about the regex: http://bit.ly/2tNzbaV
  validateRoman: function (translatedKwego) {
    const kwegoAsRoman = translatedKwego.map(i => i.roman).join().replace(/,/g, '')
    // const inconsistences = kwegoAsRoman
    //   .replace(/M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, '')

    return {
      status: 'success',
      // message: inconsistences.length > 0
      //   ? `${kwegoAsRoman} seens odd. It can probably be written in a better way.`
      //   : '',
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

    const romanValidation = this.validateRoman(translated)

    // return the translated kwego array
    return {
      status: romanValidation.status,
      message: romanValidation.message,
      kwego: kwegoAlgarisms.join().replace(/,/g, ' '),
      roman: romanValidation.data,
      decimal: this.romanToDecimals(translated)
    }
  },

  // converts to decimal an array of roman algarisms, represented as decimals
  // (X = 10, I = 1, V = 5 ...)
  romanToDecimals: function (translated) {
    const romanAsDecimal = translated.map(i => i.decimal).reverse()

    // if we have a single algarism, the job is done
    if (romanAsDecimal.length === 1) return romanAsDecimal[0]

    let sum = 0

    for (let i = 0; i < romanAsDecimal.length; i++) {
      const comparingN = romanAsDecimal[i]

      // if not the last N
      if ((i + 1) < romanAsDecimal.length) {
        const nextN = romanAsDecimal[i + 1]
        if(comparingN > nextN) {
          //subtract
          sum += (comparingN - nextN)
          i++
        } else {
          // sum
          sum += comparingN
        }
      } else {
        sum += comparingN
      }
    }

    return sum
  }
}
