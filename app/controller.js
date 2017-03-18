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

          helper.searchAll(watchList.episodes)
          // var episodes = []
          // var count = watchList.episodes.length

          // for(var index in watchList.episodes) {
          //   console.log('index: '+index)
          //   var episode = watchList.episodes[index]
          //   var qs = helper.getQS(episode)
          //
          //   extra.search(qs)
          //   .then(response => {
          //     console.log('then')
          //     var res = helper.getFirstResultBySeedDesc(response.results)
          //     console.log('index: '+index)
          //     if (res) {
          //       episodes[index] = {
          //         episodeData: episode,
          //         extraResult: {
          //           'name': res.title,
          //           'link': res.torrent_link,
          //           'size': res.size
          //         }
          //       }
          //     } else {
          //       episodes[index] = {
          //         episodeData: episode
          //       }
          //     }
          //
          //     // console.log(episode)
          //
          //     count--
          //
          //     if (count == 0) {
          //       console.log('///////////////////////////////////////////////////////////////////////////////////////////////////////')
          //       console.log(episodes)
          //       return httpResponse.render('index', {
          //         user: user.user,
          //         episodes: episodes
          //       })
          //     }
          //
          //   })
          //   .catch(err => {
          //     console.log('err')
          //     console.error(err)
          //   });
          // }
        })
      })
    } else {
      return httpResponse.render('index', {
        user: undefined
      })
    }
  },
}
