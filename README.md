
# Express View Engine with Inferno JSX and support for KrakenJS

## Install and Configuration

Install express-engine-inferno-jsx

`$ npm i express-engine-inferno-jsx --save` 

Module `express-engine-inferno-jsx` does not come with inferno packages to make sure you always can install/upgrade and use latest inferno's version.

`$ npm i babel-plugin-inferno inferno inferno-component inferno-create-element inferno-dev-utils inferno-devtools --save`

### Configuration with Express
```javascript
var express = require('express');
var app = express();

require('express-engine-inferno-jsx').attachTo(app, {
   cache: __dirname + '/views/cache', // required and should be absolute path to cache dir
   views: __dirname + '/views', // required and should be absolute path to views dir with jsx files
   typescriptSupport: false, // if you need typescript support using require *.ts and *.tsx files set true
   serverRoot: __dirname,
   requireAlias: {
    'shared-modules' : "path:../../shared-components/node_modules",
    "stores" : "path:../stores"
   },
   appRoot: __dirname + '/public/js/inferno/src', // relative path to inferno front end app root folder
   appSrc: 'public/js/inferno/src', // absolute path to inferno front end app root folder
   viewCache: false, // `false` for development `true` for production
   doctype: '<!DOCTYPE html>'
});
```

That's it, you no need to do `app.set('views', 'views')` and so on, `attachTo` will do that for you

### Kraken JS integration

You can use express-engine-inferno-jsx with KrakenJs framework (https://github.com/krakenjs/kraken-js)

example of develpment config `./config/development.json`
```json
"express": {
        "view cache": false,
        "view engine": "jsx",
        "views": "path:./views"
    },

    "view engines": {
        "jsx": {
            "module": "express-engine-inferno-jsx",
            "renderer": {
                "method": "create",
                "arguments": [
                    {
                      "cache": "path:./.build/views/cache",
                      "views": "path:./views",
                      "requireAlias": {
                        "shared-modules" : "path:../../shared-components/node_modules",
                        "stores" : "path:../stores"
                      },
                      "serverRoot": "path:",
                      "appRoot": "path:./public/js/inferno/src",
                      "appSrc": "public/js/inferno/src",
                      "viewCache": false,
                      "doctype": "<!DOCTYPE html>"

                    }
                ]
            }
        }
    }
```
example of production config `./config/production.json`
```json
"express": {
        "view cache": true,
        "view engine": "js",
        "views": "path:./.build/views"
    },

  "view engines": {
      "js": {
          "module": "express-engine-inferno-jsx",
          "renderer": {
              "method": "create",
              "arguments": [
                  {
                    "cache": "path:./.build/views",
                    "views": "path:./.build/views",
                    "requireAlias": {
                      "shared-modules" : "path:../../shared-components/node_modules",
                      "stores" : "path:../stores"
                    },
                    "serverRoot": "path:",
                    "appRoot": "path:./public/js/inferno/src",
                    "appSrc": "public/js/inferno/src",
                    "viewCache": true,
                    "doctype": "<!DOCTYPE html>"

                  }
              ]
          }
      }
  }
```

module `express-engine-inferno-jsx` has build script with method to convert JSX to Js from command line, useful for building with `grunt` or your own build tools for production.

build script usage example: `./build-jsx-views.js`

```javascript
process.env.NODE_ENV = 'production';
const chalk = require('chalk');
const path = require('path');
const buildJSXView = require('express-engine-inferno-jsx/build');
// source path for JSX views
const devViewPath = path.join(__dirname, '../views');
// destination path for JS views
const productionViewPath = path.join(__dirname, '../.build/views');

buildJSX();

function buildJSX() {
  console.log('Building JSX Views for production...');
  buildJSXView(devViewPath, productionViewPath, (err)=> {
    if (err) {
      printErrors('Build JSX Error', [err]);
      process.exit(1);
    }
    console.log(chalk.green('JSX Views Compiled Successfully.'));
    console.log();
  })
}

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}
```

to build views for production run script : `node ./build-jsx-views.js`

## Usage

Example of `users.jsx` view file
```jsx harmony
var Layout = require('./layout');

<Layout>
  <ul class="users">
    {props.users.map(user => (
    	<li key={user}>{user.name}</li>
    ))}
  </ul>
</Layout>
```

Example of `layout.jsx` view file
```jsx harmony
<html>
<head>
  <meta charset="UTF-8"/>
</head>
<body>{props.children}</body>
</html>
```

Example of router
```javascript
app.get('/users', function (req, res) {
  res.render('users', {
    users: [
      {name: 'Max'},
      {name: 'Sergey'},
      {name: 'Bob'}
    ]
  });
});
```

Output html
```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body><ul class="users"><li>Max</li><li>Sergey</li><li>Bob</li></ul></body>
</html>
```

## How it works

When you render some view, this engine takes `jsx` file like this
```jsx harmony
var Layout = require('./layout');

<Layout>
  <ul class="users">
    {props.users.map(user => (
    	<li key={user}>{user.name}</li>
    ))}
  </ul>
</Layout>
```

and compiles it to `js` file like this
```javascript
var Inferno = require('inferno');
var requireJSX = require('express-engine-jsx/require');

module.exports = function (props) {
  var __components;
    var Layout = requireJSX('./layout');
    __components =
      Inferno.createElement(
      	Layout, 
      	null,
      	Inferno.createElement(
      	  'ul',
      	  {className: 'users'},
      	  props.users.map(user => (
            Inferno.createElement(
              'li',
              {key: user},
              user.name
            )
          ))
      )
    );
  return __components;
};
```

and now this component can be rendered to html with `Inferno.renderToStaticMarkup()`.

As you can see, each jsx view file returns array of components and standard html attributes are converted to inferno attributes
```html
<div class="first" tabindex="1"></div>
<div class="second" tabindex="2"></div>
```

## API

### engine

```javascript
var engine = require('express-engine-inferno-jsx');
```

It's a function which takes three arguments:

 * `path` - path to jsx file
 * `locals` - object with properties which will be local variables in jsx file
 * `callback` - Node style callback which will receive html string as second argument

Also it has method `attachTo` which takes two arguments:

 * `server` - Express instance
 * `options` - object which will be merged to [options](#options)

### options

```javascript
var options = require('express-engine-inferno-jsx/options');
```

Object which has three properties:

 * `cache` - absolute path to cache directory
 * `views` - absolute path to views directory
 * `viewCache` - `true` || `false` default `false`
 * `requireAlias` - alias map for require in views `{}` 
 * `appSrc` - relative path to inferno client apps source folder `'apps-inferno/src'`
 * `appRoot`: absolute path to inferno client app source folder `__dirname + '/apps-inferno/src'`
 * `serverRoot` - absolute path server root folder `__dirname`
 * `babelOptions` - object of babel tranform options,
 * `doctype` - string which will be prepended to output html, default value is `"<!DOCTYPE html>\n"`
 * `template` - string wrapper of compiled jsx, default value is
   
   ```javascript
    var Component = require('inferno-component');
    var AppSharedData = require('express-engine-inferno-jsx/appshared');
    var requireJSX = require('express-engine-inferno-jsx/require');
    module.exports = function (props) {
      var __components;
      BODY
      return __components;
    };
   ```
   Where `BODY` will be replaced with your compiled jsx code

This options used by [require](#require)

### require

```javascript
var requireJSX = require('express-engine-inferno-jsx/require');
```

This is a function which you can use as regular `require` but this one can run jsx files. It checks if path is jsx file and if it is then `requireJSX` will [convert](#convert) this file to js file and put in [cache](#options) dir and then run it.

### convert

```javascript
var convert = require('express-engine-inferno-jsx/convert');
```

It is a function which can convert jsx view files to js files. It takes only two arguments:

 * `jsxPath` - path to jsx file
 * `jsPath` - path where js file should be saved
 

## License

MIT, see `LICENSE` file
