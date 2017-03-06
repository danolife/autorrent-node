const api = require('./api')
const config = require('../config/config')

module.exports = {
  index: function(response) {
    if (api.token) {
      api.getUser(function(err, response, body) {
        console.log(body)
      })
    } else {
        console.log("no token")
    }
    return response.render('index', {
      name: 'Dany'
    })
  },
}
