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
    var max = watchList.length
    console.log('max '+max)
    var count = 0
    var episodes = []
    var thenFunction = function(response) {
      var res = module.exports.getFirstResultBySeedDesc(response.results)
      if (res) {
        episodes[count] = {
          episodeData: watchList[count],
          extraResult: {
            'name': res.title,
            'link': res.torrent_link,
            'size': res.size
          }
        }
      } else {
        episodes[count] = {
          episodeData: watchList[count]
        }
      }
      console.log('count '+count+' is done / '+watchList[count].show.name)
      count++
      // Next call
      if (count < max) {
        module.exports.searchOne(watchList[count], count, max, thenFunction)
      } else {
        // console.log(episodes)
        if (cb && typeof cb == "function") {
          console.log(episodes[0])
          console.log(episodes[max-1])
          cb(episodes)
        }
      }
    }
    // First call
    this.searchOne(watchList[count], count, max, thenFunction)

  },
  searchOne: function(episode, count, max, then) {
    var qs = this.getQS(episode)
    console.log(qs)
    extra.search(qs)
    .then(response => {then(response)})
    .catch(err => {
      console.log(err)
    })
  },
  getFirstResultBySeedDesc: function(results) {
    results.sort(function(a,b) {
      return b.seeds - a.seeds;
    })
    return results[0]
  }
}
