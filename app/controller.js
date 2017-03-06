const api = require('./api')
const config = require('../config/config')

module.exports = {
  index: function(response) {
    if (api.token) {
      api.getUser(function(user) {
        return response.render('index', {
          user: user.user
        })
      })
    } else {
      return response.render('index', {
        user: undefined
      })
    }
  },
}
