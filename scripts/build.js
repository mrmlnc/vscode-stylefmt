'use strict';

const fs = require('fs');

fs.readFile('node_modules/stylefmt/lib/params.js', 'utf-8', (err, data) => {
  if (err) {
    throw err;
  }

  console.log('File is read.');

  data = data
    .replace('// same as the options in stylelint', 'if (options.skip) { return Promise.resolve(options) }')
    .replace('var cwd = process.cwd()', 'var cwd = options.cwd || process.cwd()');

  fs.writeFile('node_modules/stylefmt/lib/params.js', data, (err) => {
    if (err) {
      throw err;
    }

    console.log('Build done.');
  });
});
