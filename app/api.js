const request = require('request')

module.exports = {
  token: undefined,
  user: undefined,
  getUser(cb) {
    if (module.exports.user == undefined) {
      request({
        url: 'https://api.tvshowtime.com/v1/user',
        qs: {access_token: module.exports.token}
      }, function(err, response, body) {
        module.exports.user = JSON.parse(body);
        cb(module.exports.user)
        return module.exports.user
      })
    } else {
      cb(module.exports.user)
      return module.exports.user
    }
  },
  getWatchList: function(cb) {
    request({
      url: 'https://api.tvshowtime.com/v1/to_watch',
      qs: {access_token: module.exports.token}
    }, function(err, response, body) {
      var watchList = JSON.parse(body);
      cb(watchList)
      return watchList
    })
  }
}
