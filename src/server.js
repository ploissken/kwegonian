const PORT = process.env.PORT || 9000
const express = require('express')
const app = express()

const $log = {
  info: (label, msg) => {
    console.log(`\x1b[1m\x1b[32m[${label}]\x1b[0m ${msg}`)
  }
}

$log.info('server', 'starting')

// serve posterest as static html
app.use(express.static('public'))

// setup routes
$log.info('routes', 'starting')
require('./routes')(app, $log)
$log.info('routes', 'setup complete')

// setup weblistener
app.listen(PORT, () => {
  $log.info('server', `setup complete`)
  $log.info('server', `running at http://localhost:${PORT}/`)
})

// export app for eventually do tests
module.exports = app
