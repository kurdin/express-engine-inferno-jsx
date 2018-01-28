var p = require('path');
var fs = require('fs');
var options = require('./options');
var reload = require('require-reload')(require);
var convertJSXtoJS = require('./convert');
var componentsCache = {};

var local = /^\.{0,2}\//;

module.exports = function (path, dirname) {
	var orgPath = path;

	if (options.viewCache && componentsCache[orgPath]) {
		return componentsCache[orgPath];
	}

	if (path.indexOf(options.appSrc) === 0) {
		var appSrcFile = p.join(options.serverRoot, path);
		if (options.viewCache) {
			componentsCache[orgPath] = require(appSrcFile);
			return componentsCache[orgPath];
		}
		else return reload(appSrcFile);
	}

	if (!local.test(path)) {
		var resolvedPath = resolve(path);
		if (!resolvedPath) {
			return require(path);
		}

		path = resolvedPath;
		dirname = null;
	}

	if (dirname && options.viewCache) {
		path = p.join(dirname, path);
	} else {
		if (dirname && dirname.indexOf(options.cache) === 0) {
			dirname = dirname.replace(options.cache, options.views);
			path = p.join(dirname, path);
		}
		if (!p.isAbsolute(path)) path = p.join(options.views, path);
	}

	if (fs.existsSync(path + '.js')) {
		componentsCache[orgPath] = require(path);
		return componentsCache[orgPath];
	}

	if (path.indexOf(options.cache) === 0) {
		var viewsPath = path.replace(options.cache, options.views);

		if (fs.existsSync(viewsPath + '.jsx')) {
			convert(viewsPath + '.jsx', path + '.js');
		}
		else if (fs.existsSync(viewsPath + '.js')) {
			return require(viewsPath);
		}
	}
	else if (path.indexOf(options.views) === 0) {
		var cachePath = path.replace(options.views, options.cache);
		if (options.viewCache) {
			if (fs.existsSync(cachePath + '.js')) {
				componentsCache[orgPath] = require(cachePath + '.js');
				return componentsCache[orgPath];
			}
		}
		if (fs.existsSync(path + '.jsx')) {
			convert(path + '.jsx', cachePath + '.js');
			path = cachePath;
		}
	}

	if (options.viewCache && componentsCache[path]) {
		return componentsCache[path];
	} else if (!componentsCache[path]) {
		componentsCache[path] = require(path);
		return componentsCache[path];		
	}

	return reload(path);
};

function resolve(path) {
	try {
		path = require.resolve(path + '.jsx');
	}
	catch (e) {
		return null;
	}

	return path.replace(/\.jsx$/, '');
}

function convert(jsxPath, cachePath) {
	return convertJSXtoJS(jsxPath, cachePath);
}
