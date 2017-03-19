const cheerio = require('cheerio')
const request = require('request')
const { Website } = require('extratorrent-api')
const extra = new Website()

module.exports = {
  slugify: function(str) {
    var slug = str;

    // Replace spaces with dots
    slug = slug.replace(new RegExp(' ', 'g'), '.').toLowerCase();

    return slug
  },
  padLeft: function(number) {
    if (number < 10) {
      return '0' + number.toString()
    }
    return number.toString()
  },
  cleanShowName: function(str) {
    // Remove parenthesis and their content
    if (str.indexOf('(') > -1 && str.indexOf(')') > -1) {
      var start = str.indexOf('(')
      var end = str.indexOf(')')
      var substr = str.substr(start, end - start + 1)
      str = str.replace(substr, '')
    }
    // Replace multiple spaces with single space
    str = str.replace(/\s\s+/g, ' ');
    // Replace slashes with +
    str = str.replace(new RegExp('/', 'g'), '+');
    // Trim
    str = str.replace(/\s$/g, '');
    // Replace spaces with +
    str = str.replace(new RegExp(' ', 'g'), '+');

    return str
  },
  getQS: function(episode) {
    var showName = this.cleanShowName(episode.show.name)
    var s = this.padLeft(episode.season_number)
    var e = this.padLeft(episode.number)
    // concatenate the parts
    var qs = showName + '+' + 'S' + s + 'E' + e

    return qs
  },
  searchAll: function(watchList, cb) {
    var loaded = 0
    var episodes = []
    for (var index in watchList) {
      if (watchList.hasOwnProperty(index)) {
        // copy index in local variable
        let currentIndex = index
        let episode = watchList[index]
        let qs = this.getQS(episode)
        extra.search(qs)
        .then(response => {
          var res = module.exports.getFirstResultBySeedDesc(response.results)
          if (res) {
            episodes[currentIndex] = {
              episodeData: episode,
              extraResult: {
                'name': res.title,
                'link': res.torrent_link,
                'size': res.size
              }
            }
          } else {
            episodes[currentIndex] = {
              episodeData: episode
            }
          }
          // one more episode is ready
          loaded++

          // check if this was the last item
          if (watchList.length == loaded) {
            if (cb && typeof cb == "function") {
              cb(episodes)
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
    }
  },
  getFirstResultBySeedDesc: function(results) {
    results.sort(function(a,b) {
      return b.seeds - a.seeds;
    })
    return results[0]
  }
}
