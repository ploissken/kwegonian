
const dictionary = require('./kwego-dictionary.json')
const converter = require('./converter')
const errorParser = require('./tools')

module.exports = function (app, $log) {

  app.get('/kwego', (req, res) => {
    $log.info('routes', `kwego received ${req.query.k}`)

    const translated = converter.translateKwego(req.query.k)

    if (translated.status === `error`) {
      return res.status(400).json(translated)
    }

    $log.info('routes', `translation complete`)

    // send decimal or full calculation based on parameter dec
    if (req.query.dec) {
      res.json(translated.kwegoAsDecimal)
    } else {
      res.json({
        kwego: translated.kwegoToHuman,
        roman: translated.kwegoAsRoman,
        decimal: translated.kwegoAsDecimal
      })
    }
  })

  // catch all (404)
  app.get('*', function (req, res) {
    $log.info('routes', `404 request received`)
    res.status(404).send(`this api only responds to /kwego`)
  })
}
