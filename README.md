# express-engine-inferno-jsx

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
<body><ul class="users"><li>Max</li><li>Bob</li></ul></body>
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
  var __components = [];
    var Layout = requireJSX('./layout');
    __components.push(
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
      )
    );
  return __components[0];
};
```

and now this component can be rendered to html with `Inferno.renderToStaticMarkup()`.

As you can see, each jsx view file returns array of components and standard html attributes are converted to inferno attributes
```html
<div class="first" tabindex="1"></div>
<div class="second" tabindex="2"></div>
```

## Usage

```javascript
var express = require('express');
var app = express();

require('express-engine-inferno-jsx').attachTo(app, {
  cache: __dirname + '/cache', // required and should be absolute path to cache dir for compiled js files
  views: __dirname + '/views', // required and should be absolute path to views dir with jsx files
  doctype: '<!DOCTYPE html>'   // optional and this is default value
});
```

That's it, you no need to do `app.set('views', 'views')` and so on, `attachTo` will do that for you

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
 * `doctype` - string which will be prepended to output html, default value is `"<!DOCTYPE html>\n"`
 * `template` - string wrapper of compiled jsx, default value is
   
   ```javascript
    var Inferno = require('inferno');
    var Component = require('inferno-component');
    var AppSharedData = require('express-engine-inferno-jsx/appshared');
    var requireJSX = require('express-engine-inferno-jsx/require');
    module.exports = function (props) {
      var __components = [];
      BODY
      return __components[0];
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
