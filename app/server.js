#!/usr/bin/env nodejs
var port = 8080;
const express = require('express')
const app = express()
const config = require('../config/config')
const passport = require('passport')
var OAuth2Strategy = require('passport-oauth2').Strategy;
const controller = require('./controller')

module.exports = {
  init: function() {
    app.use((request, response, next) => {
      // console.log(request.headers)
      next()
    })

    app.get('/', (request, response) => {
      console.log('/')
      response.send(controller.index())
    })

    app.get('/auth',
      passport.authenticate('oauth2'),
      (request, response) => {
        console.log('/auth')
        response.redirect('/')
    })

    app.get('/auth/callback', (request, response) => {
      console.log('/auth/callback')
      response.redirect('/')
    })

    passport.use(new OAuth2Strategy({
      authorizationURL: 'https://www.tvshowtime.com/oauth/authorize',
      tokenURL: 'https://api.tvshowtime.com/v1/oauth/access_token',
      clientID: 'QiELLt4riIVJCxDhshZn',
      clientSecret: '-UIjzexvB3nLax4pP8-2l6jAj71sCY9KHHUcqBOp',
      callbackURL: config.base_url + '/auth/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log('Access token: ')
      console.log(accessToken)
      console.log(refreshToken)
      console.log(profile)
      console.log(cb)
      return cb()
    }
    ));

    app.use((err, request, response, next) => {
      // log the error, for now just console.log
      console.log(err)
      response.status(500).send('Something broke!')
    })

    app.listen(port)
    console.log('Server running on port ' + port)
  }
}
