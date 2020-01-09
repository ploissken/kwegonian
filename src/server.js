const PORT = process.env.PORT || 9000
const express = require('express')
const app = express()

const $log = {
  info: (label, msg) => {
    console.log(`\x1b[1m\x1b[32m[${label}]\x1b[0m ${msg}`)
  }
}

$log.info('server', 'starting setup')

// serve public folder as static html
app.use(express.static('public'))

// setup router
$log.info('router', 'starting setup')
require('./router')(app, $log)
$log.info('router', 'setup complete')

// setup weblistener
app.listen(PORT, () => {
  $log.info('server', `setup complete`)
  $log.info('server', `running at http://localhost:${PORT}/`)
})

// export app for eventually do tests
module.exports = app
