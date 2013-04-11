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
    console.log(n);
    t.equal(n.id, 'vec2');
    t.equal(n.name, 'vec2');
    t.equal(n.description, 'Library for manipulating 2d vectors');
    t.ok(n.readme);
    t.ok(n.created);
    t.ok(n.modified);
    t.equal(n.version, '1.2.0');
    t.ok(n.license && typeof n.license.join === 'function');
    t.ok(n.homepage);
    t.equal(n.author, 'tmpvar');

    t.ok(
      !n.time ||
      (n.time && Object.keys(n.time).length === 10)
    );

    t.ok(
      !n.dependencies ||
      (n.dependencies && Object.keys(n.dependencies).length === 1)
    );

    t.ok(
      !n.devDependencies ||
      (n.devDependencies && Object.keys(n.devDependencies).length === 2)
    );

    t.ok(n.maintainers);
  });
  t.end();
});