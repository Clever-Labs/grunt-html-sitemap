/*
 * grunt-html-sitemap
 * https://github.com/Clever-Labs/grunt-html-sitemap
 *
 * Copyright (c) 2014 Bill Patrianakos
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Gather up dependencies
  var util    = require('util');
  var cheerio = require('cheerio');

  grunt.registerMultiTask('html_sitemap', 'Create HTML sitemaps from a directory.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      siteBase: JSON.parse(grunt.file.read('package.json')).homepage,
      separator: false,
      searchPath: ''
    });

    var markup = cheerio.load('<ul>\n</ul>');
    var siteMap = [];

    // Iterate over all the files
    this.files.forEach(function(file) {
      var page = file.src.filter(function(filepath) {
        var extension = filepath.split('.').pop();
        if (!grunt.file.exists(filepath) || grunt.file.isDir(filepath) || filepath.split('.').pop() !== 'html') {
          grunt.log.writeln('Skipping ' + filepath);
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        if (typeof grunt.file.read(filepath) !== 'undefined') {
          var $ = cheerio.load(grunt.file.read(filepath));

          siteMap.push({
            url: options.siteBase + filepath.replace('index.html', ''),
            file: file,
            title: $('title').text()
          }); 
        }
      });
    });

    siteMap.forEach(function(page) {
      var titleString = (typeof page.title === 'string' && typeof options.separator === 'string') ? page.title.split(options.separator)[0] : page.title;
      markup('ul').append('  <li><a href="' + page.url + '">' + titleString + '</a></li>\n');
    });

    // Write result to file
    grunt.file.write(this.files[0].dest, markup.html());
  });

  function getAttributes(file, base) {
    // Read file source.
    var $ = cheerio.load(grunt.file.read(file));

    return {
      url: base + file.replace('index.html', ''),
      file: file,
      title: $('title').text()
    }; 
  }
};
