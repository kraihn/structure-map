'use strict';

var crypto = require('crypto');
var file = require('file');
var fs = require('fs');
var path = require('path');

exports.map = function (directories, options) {

  if (directories.length === 0) {
    directories.push('.');
  }
  if (!options) {
    options = {};
  }

  var cwd = process.cwd();
  var algorithm = options.hashAlgorithm ? options.hashAlgorithm : 'sha1';
  var map = {
    files: []
  };

  if (options.cwd) {
    process.chdir(options.cwd);
  }

  directories.forEach(function (directory) {

    file.walkSync(directory, function (directory) {

      var files = fs.readdirSync(directory);

      files.forEach(function (file) {
        var filepath = [directory, file].join('/');
        var filestat = fs.statSync([directory, file].join('/'));

        if (filestat.isFile(filepath)) {
          map.files.push({
            name: file,
            type: path.extname(filepath),
            directory: directory,
            filepath: filepath,
            size: filestat.size,
            blocks: filestat.blocks,
            hash: crypto.createHash(algorithm).update(fs.readFileSync(filepath)).digest('hex')
          });
        }
      });
    });
  });

  map.hash = crypto.createHash(algorithm).update(JSON.stringify(map.files)).digest('hex');

  if (options.cwd) {
    process.chdir(cwd);
  }

  return map;
};
