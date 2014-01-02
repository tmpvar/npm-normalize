var test = require('tap').test,
    fs = require('fs'),
    path = require('path'),
    normalize = require('../');
    cases = [];

fs.readdirSync(__dirname + '/json').forEach(function(file) {
  cases.push(JSON.parse(fs.readFileSync(__dirname + '/json/' + file)));
});

test('undefined is returned when invalid', function(t) {
  t.ok(typeof normalize({}) === 'undefined');
  t.end();
});

test('appropriate properties are extracted', function(t) {
  cases.forEach(function(c) {
    var n = normalize(c);
    t.equal(n.id, 'vec2');
    t.equal(n.name, 'vec2');
    t.equal(n.description, 'Library for manipulating 2d vectors');
    t.ok(n.readme);
    t.ok(n.created);
    t.ok(n.modified);
    t.equal(n.version, '1.2.0');
    t.ok(n.license && typeof n.license.join === 'function');
    t.ok(n.homepage && typeof n.homepage === 'string');
    t.ok(n.repository && typeof n.repository === 'string');
    t.equal(n.author, 'tmpvar');

    t.ok(
      !n.times ||
      (n.times && Object.keys(n.times).length === 10)
    );

    t.ok(Array.isArray(n.dependencies));
    t.ok(Array.isArray(n.devDependencies));
    t.ok(Array.isArray(n.maintainers));
    t.ok(Array.isArray(n.users));
    t.ok(Array.isArray(n.license));
  });
  t.end();
});

test('devDependencies and dependencies should work', function(t) {
  var out = normalize({
    versions: {
      "0.0.0" : {
        dependencies : { a: 1, b: 2 },
        devDependencies : {
          x : 1,
          y : 2
        }
      }
    }
  })
  t.equal(2, out.dependencies.length);
  t.equal('a', out.dependencies[0]);
  t.equal('b', out.dependencies[1]);
  t.equal(2, out.dependencies.length);
  t.end();
});


