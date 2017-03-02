const curl = require('curl')
const tvShowTime = {
  'client_id': 'QiELLt4riIVJCxDhshZn',
  //'client_secret': '-UIjzexvB3nLax4pP8-2l6jAj71sCY9KHHUcqBOp'
  'redirect_uri': 'http://localhost:8080/authback',
  'state': 'lkjfsijdfns'
}
module.exports = {
  index: function() {
    return '<h1>Welcome to Autorrent</h1>'
  },
  test: function() {
    return 'test'
  },
  auth: function() {
    return getAuthUrl()
  }
}

var getAuthUrl = function() {
  var url = 'https://www.tvshowtime.com/oauth/authorize'
  url += '?client_id=' + tvShowTime.client_id
  url += '&redirect_uri=' + tvShowTime.redirect_uri
  url += '&state=' + tvShowTime.state
  return url
}
