
module.exports = {
  // verify the roman number for errors
  sanitize: function (kwegoAsRoman) {
    const inconsistences = [ 'IIII', 'VV', 'XXXX', 'LL', 'CCCC', 'DD' ]
    const inconsistencesFound = []
    inconsistences.forEach(inc => {
      if(kwegoAsRoman.includes(inc)) {
        inconsistencesFound.push(inc)
      }
    })
    return inconsistencesFound
  },

  parseToHuman: function (array) {
    return array.join().replace(/,/g, ', ')
  }
}
