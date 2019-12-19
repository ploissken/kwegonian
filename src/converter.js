
module.exports = {
  kwegoToDecimals: function (kwegoAsDecimal) {
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
