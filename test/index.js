/**
 * @file Testing plugin
 */

const fs      = require('fs');
const path    = require('path');
const postcss = require('postcss');
const test    = require('ava');
const plugin  = require('..');

// Default PostCSS options
const defaultPostCSSOptions = {
  from: null,
};

// ------------------------------
// Utility functions
// ------------------------------

/**
 * PostCSS processor shorthand.
 *
 * @param {string} cssPath        CSS file path.
 * @param {object} options        Options of this plugin.
 * @param {object} postcssOptions Options of PostCSS.
 */
const postcssProcess = (cssPath, options, postcssOptions) => {

  return postcss([plugin(options)])
    .process(
      fs.readFileSync(path.resolve(__dirname, cssPath), 'UTF-8'),
      postcssOptions || defaultPostCSSOptions
    );

};


// ------------------------------
// Test Cases
// ------------------------------

test('generate webfonts - case001', (t) => {

  return postcssProcess(
    'fixtures/css/case001.css',
    {
      basePath: './test/fixtures',
      publishPath: './test/expect',
      stylesheetPath: './css',
      outputPath: './test/expect/fonts',
      fixedHash: 'test',
    },
  ).then((result) => {

    t.is(result.css, fs.readFileSync(path.resolve(__dirname, 'expect/css/case001.css'), 'UTF-8'));

  });

});

test('generate webfonts - case002', (t) => {

  return postcssProcess(
    'fixtures/css/case002.css',
    {
      basePath: './test/fixtures',
      publishPath: './test/expect',
      stylesheetPath: './css',
      outputPath: './test/expect/fonts',
      fixedHash: 'test',
    }
  ).then((result) => {

    t.is(result.css, fs.readFileSync(path.resolve(__dirname, 'expect/css/case002.css'), 'UTF-8'));

  });

});

test('generate webfonts - case003', (t) => {

  return postcssProcess(
    'fixtures/css/case003.css',
    {
      basePath: './test/fixtures',
      publishPath: './test/expect',
      stylesheetPath: './css',
      outputPath: './test/expect/fonts',
      fixedHash: 'test',
      classNamePrefix: 'iconfontchange',
    }
  ).then((result) => {

    t.is(result.css, fs.readFileSync(path.resolve(__dirname, 'expect/css/case003.css'), 'UTF-8'));

  });

});

test('generate webfonts - case004', (t) => {

  return postcssProcess(
    'fixtures/css/case004.css',
    {
      basePath: './test/fixtures',
      publishPath: './test/expect',
      stylesheetPath: './css',
      outputPath: './test/expect/fonts',
      fixedHash: 'test',
      classNamePrefix: 'iconfontchange',
      classNamePrefixBefore: 'beforechange',
    }
  ).then((result) => {

    t.is(result.css, fs.readFileSync(path.resolve(__dirname, 'expect/css/case004.css'), 'UTF-8'));

  });

});

test('generate webfonts - case005', (t) => {

  return postcssProcess(
    'fixtures/css/case005.css',
    {
      basePath: './test/fixtures',
      publishPath: './test/expect',
      stylesheetPath: './css',
      outputPath: './test/expect/fonts',
      fixedHash: 'test',
      classNamePrefix: 'iconfontchange',
      classNamePrefixBefore: 'beforechange',
      classNamePrefixAfter: 'afterchange',
    }
  ).then((result) => {

    t.is(result.css, fs.readFileSync(path.resolve(__dirname, 'expect/css/case005.css'), 'UTF-8'));

  });

});
