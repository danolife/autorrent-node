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
const cookieParser = require('cookie-parser')
var OAuth2Strategy = require('passport-oauth2').Strategy

module.exports = {
  init: function() {
    app.use(cookieParser())

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
        done(null, null, {'access_token': accessToken})
      }
    ));

    app.use(function (req, res, next) {
      // check if client sent cookie
      var cookie = req.cookies.tvst_access_token;
      if (cookie === undefined) {
        console.log('no cookie')
      } else {
        console.log('cookie exists', cookie)
      }
      next()
    })

    app.get('/', (req, res) => {
      console.log('/')
      var token = req.cookies.tvst_access_token
      controller.index(token, res)
    })

    app.get('/logout', (req, res) => {
      console.log('/logout')
      res.cookie('tvst_access_token', null, {maxAge: -1})
      res.redirect('/')
    })

    app.get('/auth/tvst', passport.authenticate('tvst'));

    app.get('/auth/tvst/callback', function(req, res, next) {
      passport.authenticate('tvst', function(err, user, info) {
        if (err) { return next(err); }

        // set cookie
        if (info.access_token) {
          res.cookie('tvst_access_token', info.access_token, { maxAge: 900000 })
        }

        return res.redirect('/');
      })(req, res, next);
    });

    app.use((err, request, response, next) => {
      // log the error, for now just console.log
      console.log(err)
      response.status(500).send('Something broke!')
    })

    app.listen(port)
    console.log('Server running on port ' + port)
  }
}
