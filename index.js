var semver = require('semver');
var fallbackDate = (new Date("jan 1 2010")).toISOString();
// Normalize npm module structure coming from couch
module.exports = function(project) {

  var ret = {};

  if (!project || project.error) {
    return;
  }

  if (!project['dist-tags']) {
    if (!project.versions) {
      return;
    }

    ret.versions = Object.keys(project.versions) || [];
    ret.versions.sort(function(a,b) {
      return semver.gt(a, b) ? -1 : 1;
    });
    project['dist-tags'] = { latest: ret.versions[0] };
  }

  var latestVersionString, latest;
  if (project['dist-tags'].latest) {
    latestVersionString = project['dist-tags'].latest
    latest = project.versions[latestVersionString];
  } else if (Object.keys(project['dist-tags']).length) {

    latestVersionString = Object.keys(project['dist-tags']).sort(function(a, b) {
      return (semver.gt(a,b)) ? -1 : 1;
    })[0];

    latest = project.versions[latestVersionString];
  } else {
    latest = project;
  }

  if (!latest) {
    return;
  }

  ret.id = ret.name = project.name;
  ret.description = project.description || '';
  ret.version = latestVersionString || '';

  ret.readme = latest.readme || project.readme || '';
  if (!ret.readme) {
    delete ret.readme;
  }

  var maintainers = project.maintainers || latest.maintainers;
  if (maintainers && maintainers.length) {
    ret.maintainers = [];
    maintainers.forEach(function(maintainer) {
      if (maintainer.name) {
        ret.maintainers.push(maintainer.name);
      }
    });
  }

  if (latest._npmUser) {
    if (latest._npmUser.name) {
      ret.author = latest._npmUser.name;
    } else {
     ret.author = latest._npmUser;
    }
  } else if (ret.maintainers) {
    ret.author = ret.maintainers[0];
  }


  ret.repository = latest.repository;
  ret.homepage = latest.homepage ||
                 project.homepage;

  if (ret.repository && typeof ret.repository.url !== 'undefined') {
    ret.repository = ret.repository.url;
  }

  if (!ret.repository) {
    delete ret.repository;
  }

  if (!ret.homepage) {
    var repoUrl = ret.repository;

    if (repoUrl && repoUrl.replace) {
      ret.homepage = repoUrl.replace(/.*\/\//,'http://')
    } else {
      ret.homepage = 'http://npmjs.org/package/' + project.name;
    }
  }

  if (ret.homepage && ret.homepage.url) {
    ret.homepage = ret.homepage.url;
  }


  var license = latest.license || project.license
  ret.license = [];

  if (license) {
    if (!license.push) {
      license = license.type || license.name || license;
      license = license.split(/[^a-z0-9]/i);
    }

    license.forEach(function(l) {
      ret.license.push(l.type || l || '');
    });
  }

  var time = latest.time || project.time || {};
  ret.created =  project.ctime || time.created || fallbackDate;
  ret.modified = project.mtime || time.modified || fallbackDate;

  if (Object.keys(time).length > 2) {
    delete time.created;
    delete time.modified;
    ret.time = time;
  }

  ret.users = latest.users || project.users;
  ret.dependencies = latest.dependencies;
  ret.devDependencies = latest.devDependencies;
  ret.keywords = latest.keywords || latest.tags || [];
  if (ret.keywords.split) {
    ret.keywords = ret.keywords.split(',');
  }

  // Final cleanup pass
  var f = {};
  Object.keys(ret).forEach(function(key) {
    if (typeof ret[key] !== 'undefined' && ret[key] !== null) {
      f[key] = ret[key];
    }
  });

  return f;
}