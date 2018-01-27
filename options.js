module.exports = {
	cache: '',
	views: '',
	viewCache: false,
	appSrc: 'apps-inferno/src',
  serverRoot: __dirname,
  babelOptions: {
  	presets: [
      [
        'env',
        {
          useBuiltIns: 'usage',
          debug: false,
          "node": "current"
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
			'transform-decorators-legacy', ['inferno', { imports: true }], 'syntax-jsx'
		]
	},
  appRoot: __dirname + '/apps-inferno/src',
	doctype: "<!DOCTYPE html>\n",
  template: `
var requireJSX = require('express-engine-inferno-jsx/require');

module.exports = function (props) {
  var __components;
  BODY
  return __components;
};`
};
