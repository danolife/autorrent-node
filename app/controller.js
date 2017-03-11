const api = require('./api')
const config = require('../config/config')

module.exports = {
  index: function(token, response) {
    if (token) {
      api.getUser(token, function(user) {
        api.getWatchList(token, function(watchList) {
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
