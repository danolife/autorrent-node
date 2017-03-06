const api = require('./api')
const config = require('../config/config')

module.exports = {
  index: function(response) {
    if (api.token) {
      api.getUser(function(user) {
        api.getWatchList(function(watchList) {
          return response.render('index', {
            user: user.user,
            episodes: watchList.episodes
          })
        })
      })
    } else {
      return response.render('index', {
        user: undefined
      })
    }
  },
}
