# npm-normalize

normalize npm package metadata

# install

`npm install npm-normalize`

# use

```javascript

var normalize = require('npm-normalize');
require('request').get({
  url : 'http://isaacs.iriscouch.com/registry/tap',
  json: true
}, function(e, r, obj) {
  obj = normalize(obj);
})

```

# License

MIT © 2013 solids l.l.c.
