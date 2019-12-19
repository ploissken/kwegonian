
const dictionary = require('./kwego-dictionary.json')
const converter = require('./converter')
const errorParser = require('./error-parser')

module.exports = function (app, $log) {

  app.get('/kwego', (req, res) => {
    $log.info('routes', `kwego received ${req.query.k}`)

    // if no query is received, we reply with a bad request
    if(!req.query.k) {
      return res.status(400).send(`no kwego received`)
    }

    const kwegoAlgarisms = req.query.k.replace(/ /g, ',').split(',')
    const translated = []
    const translationErrors = []

    kwegoAlgarisms.forEach(algarism => {
      const translatedChar = dictionary[algarism.toLowerCase()]

      if (!translatedChar) {
        // if we cannot translate the algarism,
        // we save it as an error
        translationErrors.push(algarism)
      } else {
        translated.push(translatedChar)
      }
    })

    // reply with a bad request if any translation error occured
    if(translationErrors.length) {
      return res.status(400)
        .send({ message: `unable to decode "${errorParser.readable(translationErrors)}"` })
    }

    // verify and reply with bad request any numerical inconsistence
    const kwegoAsRoman = translated.map(i => i.roman).join().replace(/,/g, '')
    const inconsistenceErrors = errorParser.sanitize(kwegoAsRoman)
    if (inconsistenceErrors.length) {
      const errorMessage = `numerical inconsistence(s): "${errorParser.readable(inconsistenceErrors)}"`
      $log.info('error', errorMessage)
      return res.status(400).json({ message: errorMessage })
    }

    // compose and send response
    const responseObj = {
      kwego: kwegoAlgarisms.join().replace(/,/g, ' '),
      roman: kwegoAsRoman,
      decimal: converter.kwegoToDecimals(translated.map(i => i.decimal))
    }
    $log.info('routes', `translation complete`)
    res.send(responseObj)
  })

  // catch all (404)
  app.get('*', function (req, res) {
    $log.info('routes', `404 request received`)
    res.status(404).send(`this api only responds to /kwego`)
  })
}
