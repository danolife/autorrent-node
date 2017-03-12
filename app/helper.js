const cheerio = require('cheerio')
const request = require('request')

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
  search: function(str) {
    var base_url = 'http://extratorrent.cc/'
    var qs = 'search/?search=' + str
    request(base_url + qs, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        console.log(html)
        var $ = cheerio.load(html)
        $('#e_content table.tl tbody').find('tr').each(function(index, element) {
          console.log($(element).find('td').eq(2).find('a').text())
        })
      }
    });
  }
}
