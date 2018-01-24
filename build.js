'use strict';

var async = require('async');
var path = require('path');
var glob = require('glob');
var convertJSXtoJS = require('./convert');

module.exports = function(location, destination, cb) {
    var fn = [];
    var total_files;
    var locations_finished = 0;

    glob('**/*.jsx', {
      cwd: location
    }, function(err, files) {
      if (err) {
        return cb(err);
      }
      total_files = files.length;
      console.log('Total JSX Files to Build: ', total_files);      
      files.forEach(function(file) {
        var filePathJSX = path.join(path.join(location, file));
        var filePathJS = path.join(path.join(destination, file.replace(/\.(jsx)$/, '.js')));
        fn.push(function(cb) {
          console.log('Build JSX View: ' + file);
          convertJSXtoJS(filePathJSX, filePathJS);
          return cb(null, filePathJS);
        });
      });

      async.parallelLimit(fn, 10, function(err, location) {
        if (err) {
          return cb(err);
        }
        locations_finished++;
        if (locations_finished === total_files) cb(null);
      });
    });
};
