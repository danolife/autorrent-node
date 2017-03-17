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

          var count = watchList.episodes.length

          for(var index in watchList.episodes) {

            var episode = watchList.episodes[index]
            var qs = helper.getQS(episode)

console.log('')
console.log('avant')
console.log(watchList.episodes[index])

            extra.search(qs)
            .then(response => {
              var res = helper.getFirstResultBySeedDesc(response.results)
              watchList.episodes[index].extraResult = {
                'name': res.title,
                'link': res.torrent_link,
                'size': res.size
              }
              console.log('')
              console.log('apres')
              console.log(watchList.episodes[index])

              // console.log(episode)

              count--

              if (count == 0) {
                console.log('///////////////////////////////////////////////////////////////////////////////////////////////////////')
                console.log(watchList.episodes)
                return httpResponse.render('index', {
                  user: user.user,
                  episodes: watchList.episodes
                })
              }

            })
            .catch(err => {
              console.error(err)
            });
          }
        })
      })
    } else {
      return response.render('index', {
        user: undefined
      })
    }
  },
}
