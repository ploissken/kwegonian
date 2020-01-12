const PORT = process.env.PORT || 9000
const express = require('express')
const app = express()
const translator = require('./translator')

// mocking some simple logging system
const $log = {
  info: (label, msg) => {
    console.log(`\x1b[1m\x1b[32m[${label}]\x1b[0m ${msg}`)
  }
}
$log.info('server', 'starting setup')

// serve a sample frontend in public folder
app.use(express.static('public'))

// setup translation route
app.get('/kwego', (req, res) => {
  $log.info('server', `kwego received ${req.query.k}`)

  const result = translator.translateKwego(req.query.k)
  $log.info('server', `translation complete`)
  $log.info('server', JSON.stringify(result))

  // reply with translation result
  return result.status === `error`
    ? res.status(400).json(result)
    : req.query.dec
      ? res.send(result.decimal + '')
      : res.json(result)
})

// catch all route (404)
app.get('*', function (req, res) {
  $log.info('server', `404 request received: ${req.query}`)
  res.status(404).send(`this api accepts requests at /kwego only`)
})

// setup weblistener
app.listen(PORT, () => {
  $log.info('server', `setup complete`)
  $log.info('server', `running at http://localhost:${PORT}/`)
})

module.exports = app
