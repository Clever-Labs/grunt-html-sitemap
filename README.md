# grunt-html-sitemap

> Create HTML sitemaps from a directory of static files.

Useful for sites that maintain a `<ul>` sitemap on its own page that should be updated on each build or deploy.

__Note:__ This task works but needs a lot of work. Pull requests are very welcome.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

### Installation

```shell
npm install grunt-html-sitemap --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-html-sitemap');
```

Or install [load-npm-tasks](https://github.com/sindresorhus/load-grunt-tasks) so you don't have to worry about that anymore.

## The "html_sitemap" task

This task traverses a directory of static files and creates an HTML sitemap from its contents. When run, this task will build a map of all static HTML files in a directory and use their paths, title tags, and some additional options (detailed below) to create an HTML sitemap.

This task generates HTML only, it __does not create XML sitemaps__.

### Overview
In your project's Gruntfile, add a section named `html_sitemap` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  html_sitemap: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.siteBase
Type: `String`
Default value: `'/'`

A string to be appended to the `href` on each anchor tag. Defaults to creating all links as relative to site root. For example, if you specify `http://example.com` as your base then the task will append that URL to the paths it finds.

#### options.separator
Type: `String`, `Boolean`
Default value: `false`

A string to separate page names from site names in title tags. Many sites use a "Page name | Company Name" format in their title tags. This task uses each page's title tag to generate anchor text for each list item in the sitemap. When this option is set the first part of the title tag before the separator will be used as anchor text.

#### options.searchPath
Type: `String`
Default value: `''`

A path prefix to strip from generated URLs.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  html_sitemap: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  html_sitemap: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
