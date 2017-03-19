const api = require('./api')
const config = require('../config/config')
const { Website } = require('extratorrent-api')
const extra = new Website()
const helper = require('./helper')

module.exports = {
  index: function(token, httpResponse) {
    if (token) {
      api.getUser(token, function(user) {

        api.getWatchList(token, function(watchList) {

          var episodes = helper.searchAll(watchList.episodes, function(episodes) {
            return httpResponse.render('index', {
              user: user.user,
              episodes: episodes
            })
          })
          
        })
      })
    } else {
      return httpResponse.render('index', {
        user: undefined
      })
    }
  },
}
