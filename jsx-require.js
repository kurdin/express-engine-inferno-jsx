const fs = require('fs');
const babel = require('babel-core');
const plugin = require('babel-plugin-inferno');

require.extensions['.jsx'] = function (module, filename) {

	let content = fs.readFileSync(filename, 'utf8');
	let compiled = babel.transform(content, {
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
	}).code;

	return module._compile(compiled, filename);
};