
const dictionary = require('./kwego-dictionary.json')
const converter = require('./converter')
const errorHandler = require('./error-handler')

module.exports = function (app, $log) {

  app.get('/kwego', (req, res) => {
    $log.info('routes', `kwego received ${req.query.k}`)

    // if no query is received, we reply with a bad request
    if(!req.query.k) {
      return res.status(400).send(`no kwego received`)
    }

    const kwegoAlgarisms = req.query.k.split(',')
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
        .send(`unable to decode "${errorHandler.readable(translationErrors)}"`)
    }

    // verify and reply with bad request any numerical inconsistence
    const kwegoAsRoman = translated.map(i => i.roman).join().replace(/,/g, '')
    const inconsitenceErrors = errorHandler.sanitize(kwegoAsRoman)
    if (inconsitenceErrors.length) {
      return res.status(400)
        .send(`numerical inconsistence(s): "${errorHandler.readable(inconsitenceErrors)}"`)
    }

    // compose response
    const responseObj = {
      kwego: kwegoAlgarisms.join().replace(/,/g, ' '),
      roman: kwegoAsRoman,
      decimal: converter.kwegoToDecimals(translated.map(i => i.decimal))
    }

    $log.info('routes', `translation complete`)
    $log.info('routes', `kwego: "${responseObj.kwego}"`)
    $log.info('routes', `roman: "${responseObj.roman}"`)
    $log.info('routes', `decimals: "${responseObj.decimal}"`)

    res.send(responseObj)
  })

  // catch all (404)
  app.get('*', function (req, res) {
    $log.info('routes', '* request received')
    res.status(404)
      .send(`this api only responds to /kwego`)
  })
}
