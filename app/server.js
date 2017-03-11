#!/usr/bin/env nodejs
const port = 8080;
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const controller = require('./controller')
const api = require('./api')
const config = require('../config/config')
const passport = require('passport')
var OAuth2Strategy = require('passport-oauth2').Strategy

module.exports = {
  init: function() {
    app.use((request, response, next) => {
      // console.log(request.headers)
      next()
    })

    app.engine('.hbs', exphbs({
      defaultLayout: 'layout',
      extname: '.hbs',
      layoutsDir: path.join(__dirname, '../views/layouts')
    }))
    app.set('view engine', '.hbs')
    app.set('views', path.join(__dirname, '../views'))

    passport.use('tvst', new OAuth2Strategy({
      authorizationURL: 'https://www.tvshowtime.com/oauth/authorize',
      tokenURL: 'https://api.tvshowtime.com/v1/oauth/access_token',
      clientID: 'QiELLt4riIVJCxDhshZn',
      clientSecret: '-UIjzexvB3nLax4pP8-2l6jAj71sCY9KHHUcqBOp',
      callbackURL: config.base_url + '/auth/tvst/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      api.token = accessToken
      done()
    }
  ));

    app.get('/', (req, res) => {
      console.log('/')
      controller.index(res)
    })

    // Redirect the user to the OAuth 2.0 provider for authentication.  When
    // complete, the provider will redirect the user back to the application at
    //     /auth/provider/callback
    app.get('/auth/tvst', passport.authenticate('tvst'));

    // The OAuth 2.0 provider has redirected the user back to the application.
    // Finish the authentication process by attempting to obtain an access
    // token.  If authorization was granted, the user will be logged in.
    // Otherwise, authentication has failed.
    app.get('/auth/tvst/callback',
      passport.authenticate('tvst', { successRedirect: '/', failureRedirect: '/' })
    );

    app.use((err, request, response, next) => {
      // log the error, for now just console.log
      console.log(err)
      response.status(500).send('Something broke!')
    })

    app.listen(port)
    console.log('Server running on port ' + port)
  }
}
