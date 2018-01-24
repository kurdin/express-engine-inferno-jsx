var options = require('./options');
var requireJSX = require('./require');
var Inferno = require('inferno');
require('./jsx-require');
var InfernoServer = require('inferno-server');

module.exports = engine;

function engine(path, params, cb) {
	var Component = requireJSX(path.replace(/\.jsx$/, ''));
	cb(null,
		options.doctype +
		InfernoServer.renderToStaticMarkup(Component(params)).replace(/<!--!-->/gm, '').replace(/<!---->/gm, '')
	);
}

engine.create = function (config) {
	if (!config.cache) {
		throw new Error('Parameter "cache" is required');
	}

	if (!config.views) {
		throw new Error('Parameter "views" is required');
	}

	engine.setOptions(config);
  return engine;
};

engine.attachTo = function (server, params) {
	if (!params.cache) {
		throw new Error('Parameter "cache" is required');
	}

	if (!params.views) {
		throw new Error('Parameter "views" is required');
	}

	engine.setOptions(params);

	server.engine('jsx', engine);
	server.set('views', options.views);
	server.set('view cache', options.viewCache);
	server.set('view engine', 'jsx');

	return engine;
};

engine.setOptions = function (params) {
	if (params.cache) {
		if (params.cache.charAt(0) !== '/') {
			throw new Error('Parameter "cache" should be absolute path to directory');
		}

		options.cache = params.cache;
	}

	if (params.views) {
		if (params.views.charAt(0) !== '/') {
			throw new Error('Parameter "views" should be absolute path to directory');
		}

		options.views = params.views;
	}

	if (params.hasOwnProperty('doctype')) {
		options.doctype = params.doctype;
	}

	if (params.hasOwnProperty('babelOptions')) {
		options.babelOptions = params.babelOptions;
	}

	if (params.hasOwnProperty('serverRoot')) {
		options.serverRoot = params.serverRoot;
	}

	if (params.hasOwnProperty('appRoot')) {
		options.appRoot = params.appRoot;
	}

	if (params.hasOwnProperty('appSrc')) {
		options.appSrc = params.appSrc;
	}

	if (params.hasOwnProperty('viewCache')) {
		options.viewCache = params.viewCache;
	}
	return engine;
};