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
  var _       = require('lodash');

  // Register our task
  grunt.registerMultiTask('html_sitemap', 'Create HTML sitemaps from a directory.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var taskOpts = this.options({
      siteBase: JSON.parse(grunt.file.read('package.json')).homepage,
      separator: false,
      searchPath: ''
    });

    var markup    = cheerio.load('<ul>\n</ul>');
    var regbuild  = /<!--\s*sitemap:(\w+)(?:\(([^\)]+)\))?\s*([^\s]+)\s*-->/; // Extract options specified in comment blocks
    var siteMap   = [];
    var outFiles  = [];

    this.files.forEach(function(file) {
      // Add an output path to the list
      outFiles.push(file.dest);

      // Get the contents of the file
      var page = file.src.filter(function(path) {
        if (!grunt.file.exists(path) || grunt.file.isDir(path) || !grunt.file.isFile(path)) {
          grunt.warn('Invalid input file in your ' + this.target + ': ' + path);
          return false;
        } else {
          console.log(util.inspect(path));
          return true;
        }
      }).map(function(path) {
        var basePath = (typeof path === 'undefined') ? path : path.replace(taskOpts.searchPath, '');
        return {
          contents: grunt.file.read(path),
          path: taskOpts.siteBase + basePath
        };
      });

      console.log('This ran');
      console.log(util.inspect(page));

      if (page) {
        page.forEach(function(pageData) {
          var lines = pageData.contents.replace(/\r\n/g, '\n').split(/\n/);
          var options = {};

          // Iterate over each line
          lines.forEach(function(line) {
            var indent = (line.match(/^\s*/) || [])[0];
            var option = line.match(regbuild);

            // If option found
            if (option && option[1] === 'anchor') {
              options.anchor = option[3];
            } else if (option && option[1] === 'order') {
              options.order = option[2];
            }
          });

          // Check if file needs to be read
          if (options.anchor) {
            pageData.anchor = options.anchor;
          } else {
            var $ = cheerio.load(pageData.contents);
            pageData.anchor = (!taskOpts.separator) ? $('title').text() : $('title').text().split(taskOpts.separator)[0];
          }

          // Append the new item to the sitemap <ul>
          markup('ul').append('  <li><a href="' + pageData.path + '">' + pageData.anchor + '</a></li>\n');
        });
      }
    });

console.log(util.inspect(outFiles));
    
    // Get unique destinations and write to them
    var destinations = _.uniq(outFiles, function(file) {
      grunt.file.write(file, markup.html());
      grunt.log.writeln('Sitemap file written to ' + file);
    });

    // // Iterate over all the files
    // this.files.forEach(function(file) {
    //   var page = file.src.filter(function(filepath) {
    //     // Ensure the type is HTML
    //     var extension = filepath.split('.').pop();
    //     if (!grunt.file.exists(filepath) || grunt.file.isDir(filepath) || filepath.split('.').pop() !== 'html') {
    //       grunt.log.writeln('Skipping ' + filepath);
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   }).map(function(filepath) {
    //     if (!filepath || typeof grunt.file.read(filepath) !== 'undefined') {
    //       var $ = cheerio.load(grunt.file.read(filepath));

    //       // Check for page-specific options 
    //       var pageOpts = $('head').contents().filter(function() {
    //         return this.nodeType === 8;
    //       }).get(0);

    //       var titleString = (!options.separator) ? $('title').text() : $('title').text().split(options.separator)[0];

    //       // Add a page object to the sitemap
    //       siteMap.push({
    //         url: options.siteBase + filepath.replace('index.html', ''),
    //         file: file,
    //         title: titleString
    //       }); 
    //     }
    //   });
    // });

    // siteMap.forEach(function(page) {
    //   var titleString = (typeof page.title === 'string' && typeof options.separator === 'string') ? page.title.split(options.separator)[0] : page.title;
    //   markup('ul').append('  <li><a href="' + page.url + '">' + titleString + '</a></li>\n');
    // });

    // // Write result to file
    // grunt.file.write(this.files[0].dest, markup.html());
  });

  /**
   * Read title options
   *
   * Reads the title options set in
   * HTML comments and replaces default
   * title with custom one.
   *
   * @param file - The HTML to parse
   */
  //  function readTitleOpts(file, sep) {}

  // function getAttributes(file, base) {
  //   // Read file source.
  //   var $ = cheerio.load(grunt.file.read(file));

  //   return {
  //     url: base + file.replace('index.html', ''),
  //     file: file,
  //     title: $('title').text()
  //   }; 
  // }
};
