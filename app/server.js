#!/usr/bin/env nodejs
var port = 8080;
const express = require('express')
const app = express()
const controller = require('./controller')
var tvShowTimeCode;

module.exports = {
  init: function() {
    app.use((request, response, next) => {
      // console.log(request.headers)
      next()
    })

    app.get('/', (request, response) => {
      response.send(controller.index())
    })

    app.get('/test', (request, response) => {
      response.send(controller.test())
    })

    app.get('/auth', (request, response) => {
      response.redirect(controller.auth())
    })

    app.get('/authback', (request, response) => {
      tvShowTimeCode = request.query.code
      response.redirect('/')
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
