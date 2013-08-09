
/**
 * Module dependencies.
 */

var path = require('path');

/**
 * Original `npm` args.
 */

var args = JSON.parse(process.env.npm_config_argv).original;

/**
 * Npm metadata.
 */

exports.npm = {
  pwd: process.env.PWD,
  node: process.env.npm_node_execpath,
  args: args,
  lifecycle: process.env.npm_lifecycle_event,
  isGlobal: !!process.env.npm_config_global, // '', 'true' are values I've seen.
  isLink: !!process.env.npm_config_link || args.indexOf('link') > -1,
  globals: {
    modules: collectPaths(path.join(process.env.npm_config_prefix, 'lib')),
    executables: path.join(process.env.npm_config_prefix, 'bin')
  },
  locals: {
    modules: collectPaths(process.cwd()),
    executables: path.join(process.cwd(), 'node_modules/.bin')
  }
};

exports.global = function(makeGlobal){
  if (makeGlobal) {
    process.mainModule.paths = exports.npm.globals.modules;
  } else {
    process.mainModule.paths = exports.npm.locals.modules;
  }
};

/**
 * Collect paths for local require.
 */

function collectPaths(dir) {
  var paths = [];
  var root = path.resolve('/');
  while (root != dir) {
    paths.push(path.join(dir, 'node_modules'));
    dir = path.dirname(dir);
  }
  return paths;
}