const api = require('./api')
const config = require('../config/config')
const { Website } = require('extratorrent-api')
const extra = new Website()
const helper = require('./helper')

module.exports = {
  index: function(token, response) {
    if (token) {
      api.getUser(token, function(user) {
        api.getWatchList(token, function(watchList) {
          for(var index in watchList.episodes){
            var episode = watchList.episodes[index]
            var qs = helper.getQS(episode)
            extra.search(qs)
            .then(response => {
              var res = response.results[0]
              var name = res.title
              var link = res.url
              var size = res.size
              console.log(name + ' ' + link + '(' + size + ')')
            })
            .catch(err => console.error(err));
          }



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
