const request = require('request')

module.exports = {
  getUser(token, cb) {
    request({
      url: 'https://api.tvshowtime.com/v1/user',
      qs: {access_token: token}
    }, function(err, response, body) {
      var user = JSON.parse(body);
      cb(user)
      return user
    })
  },
  getWatchList: function(token, cb) {
    request({
      url: 'https://api.tvshowtime.com/v1/to_watch',
      qs: {access_token: token}
    }, function(err, response, body) {
      var watchList = JSON.parse(body);
      cb(watchList)
      return watchList
    })
  }
}
