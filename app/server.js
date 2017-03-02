#!/usr/bin/env nodejs
var port = 8080;
const express = require('express')
const app = express()
const controller = require('./controller')

module.exports = {
  init: function() {
    app.use((request, response, next) => {
      // console.log(request.headers)
      next()
    })

    app.get('/', (request, response) => {
      response.send(controller.index(request, response))
    })

    app.get('/test', (request, response) => {
      response.send(controller.test(request, response))
    })

    app.use((err, request, response, next) => {
      // log the error, for now just console.log
      console.log(err)
      response.status(500).send('Something broke!')
    })

    app.listen(port)
    console.log('Server running on port ' + port)
  }
}
