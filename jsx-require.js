const fs = require('fs');
const babel = require('babel-core');
var options = require('./options');

require.extensions['.jsx'] = function (module, filename) {

  let content = fs.readFileSync(filename, 'utf8');
  let compiled = babel.transform(content, options.babelOptions).code;

  return module._compile(compiled, filename);
};