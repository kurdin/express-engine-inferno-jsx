module.exports = {
	cache: '',
	views: '',
	viewСache: true,
	appSrc: 'apps-inferno/src',
  serverRoot: __dirname,
  babelOptions: {
  	presets: [
      [
        'env',
        {
          useBuiltIns: 'usage',
          debug: false,
          targets: {
            browsers: ['last 2 versions', 'not ie > 8', 'ie 11', 'ie 10', 'not android > 4', 'not edge > 10']
          }
        }
      ],
      'stage-2'
    ],
		plugins: [
				['module-resolver', {
        'alias': {
          'apps-inferno': require('path').resolve(__dirname + '/apps-inferno/src/')
        }
    	}],
			'transform-decorators-legacy', 'transform-async-to-generator', ['inferno', { imports: true }], 'syntax-jsx'
		]
	},
  appRoot: __dirname + '/apps-inferno/src',
	doctype: "<!DOCTYPE html>\n",
	template: `
var Inferno = require('inferno');
var Component = require('inferno-component');
var AppSharedData = require('express-engine-inferno-jsx/appshared');
var requireJSX = require('express-engine-inferno-jsx/require');

module.exports = function (props) {
  var __components = [];
  BODY
  return __components[0];
};`
};