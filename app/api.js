const request = require('request')

module.exports = {
  token: undefined,
  getUser(cb) {
    request({
      url: 'https://api.tvshowtime.com/v1/user',
      qs: {access_token: module.exports.token}
    }, function(err, response, body) {
      cb(err, response, body)
    })
  }
}
