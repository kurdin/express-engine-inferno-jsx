const fs = require('fs');
const babel = require('babel-core');
const ts = require('typescript');
let options = require('./options');

['.ts', '.tsx'].forEach(ext => {
	require.extensions[ext] = function(m, filename) {
		const content = fs.readFileSync(filename).toString();

		try {
			const compiled = ts.transpile(content, {
				target: ts.ScriptTarget.ES5,
				jsx: 'preserve',
				module: ts.ModuleKind.CommonJs
			});

			let compiledBabel = babel.transform(compiled, options.babelOptions).code;

			return m._compile(compiledBabel, filename);
		} catch (err) {
			console.error(`TypeScript Compiler Error: Script ${filename}`);
			console.error(err.stack);
			throw err;
		}
	};
});