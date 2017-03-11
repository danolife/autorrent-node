module.exports = {
  slugify: function(str) {
    var slug = str;

    // Remove parenthesis and their content
    if (slug.indexOf('(') > -1 && slug.indexOf(')') > -1) {
      var start = slug.indexOf('(')
      var end = slug.indexOf(')')
      var substr = slug.substr(start, end - start + 1)
      slug = slug.replace(substr, '')
    }

    // Remove multiple spaces
    slug = slug.replace(/ +(?= )/g,'');

    // Replace spaces with dots
    slug = slug.replace(new RegExp(' ', 'g'), '.').toLowerCase();

    return slug
  }
}
