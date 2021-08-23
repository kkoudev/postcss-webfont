/**
 * @file Generate iconfonts from stylesheets - entry point
 */
const postcss   = require('postcss');
const rulesets  = require('./rulesets');

// default options
const defaultOptions = {

  basePath: './',
  outputPath: './',
  publishPath: '',
  stylesheetPath: './',
  cachePath: '.fontcache.json',
  startUnicode: 0xEA01,
  prependUnicode: false,
  formats: ['eot', 'woff', 'ttf'],
  verticalAlign: 'middle',
  classNamePrefix: 'iconfont',
  classNamePrefixBefore: 'before',
  classNamePrefixAfter: 'after',
  cachebuster: 'hash',
  cachebusterFixed: '',

};

module.exports = (options) => {

  const usingOptions = Object.assign({}, defaultOptions, options);

  return {
    postcssPlugin: 'postcss-webfont',
    Once (root) {

      return rulesets(root, usingOptions);

    },
  };

};
