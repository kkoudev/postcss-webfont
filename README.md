# postcss-webfont

[![npm](https://img.shields.io/npm/v/postcss-webfont.svg)](https://www.npmjs.com/package/postcss-webfont)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/kidney/postcss-webfont/master/LICENSE)

`postcss-webfont` is PostCSS plugin for generating web fonts from stylesheets.

## Installation

### npm

```shell
npm install postcss-webfont --save-dev
```

### yarn

```shell
yarn add postcss-webfont --dev
```

## Usage

```javascript
const postcss = require('postcss');
const webfont = require('postcss-webfont');

const options = {
  outputPath: './dist/fonts/'
};

postcss([webfont(options)])
  .process(css)
  .then(function(result) {
    fs.writeFileSync('./dist/style.css', result.css);
  });
```


## Options

### basePath

Your base path that will be used for svg files with absolute CSS urls.

Type: `String`

Default: `./`


### outputPath

Relative path to the directory that will keep your output font file.

Type: `String`

Default: `./`


### stylesheetPath

Relative path to the base directory that will keep your stylesheet file.

Type: `String`

Default: `./`


### publishPath

The url to the output directory resolved relative to the HTML page.

Type: `String`

Default: ``


### cachePath

The cache file path of generated fonts.

Type: `String`

Default: `.fontcache.json`


### formats

The output formats of font-face src property.

Type: `Array<String>`

Default: `['ttf', 'eot', 'woff']`


### startUnicode

Starting codepoint used for the generated glyphs.

Type: `Integer`

Default: `0xEA01`


### prependUnicode

Prefix files with their automatically allocated unicode code point.

Type: `Boolean`

Default: `false`


### verticalAlign

The vertical-align property value.

Type: `String`

Default: `middle`


### classNamePrefix

The generating class name prefix.

Type: `String`

Default: `iconfont`


### classNamePrefixBefore

The generating class name prefix for before pseudo element.

Type: `String`

Default: `before`


### classNamePrefixAfter

The generating class name prefix for after pseudo element.

Type: `String`

Default: `after`


### cachebuster

The cachebuster type.  
To disable is specified null or undefined.

Cachebuster types:
  * hash  : Generating font hash.
  * fixed : Fixed cachebuster. The fixed value is specified `cachebusterFixed` option.

Type: `String`

Default: `hash`


### cachebusterFixed

The fixed cachebuster value.

Type: `String`

Default: ``


### svgicons2svgfont options

The options of [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont#new-svgicons2svgfontstreamoptions) are available:

* options.fontWeight
* options.fontStyle
* options.fixedWidth
* options.centerHorizontally
* options.normalize
* options.fontHeight
* options.round
* options.descent


## Example

```
├─┬ css/
│ └─ style.css
├── fonts/
└─┬ svg/
  ├─ arrow-up-left.svg
  └─ arrow-up-right.svg
```

style.css

```css
// before
@font-face {
  font-family: 'font-awesome';
  src: url('./fonts/*.svg');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

```css
// after
@font-face {
  font-family: 'font-awesome';
  src:  url('./fonts/font-awesome.eot');
  src:  url('./fonts/font-awesome.eot#iefix') format('embedded-opentype'),
    url('./fonts/font-awesome.ttf') format('truetype'),
    url('./fonts/font-awesome.woff') format('woff'),
    url('./fonts/font-awesome.svg?#font-awesome') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

[class^='iconfont-font-awesome-']::before, [class*=' iconfont-font-awesome-']::before,
[class^='iconfont-before-font-awesome-']::before, [class*=' iconfont-before-font-awesome-']::before,
[class^='iconfont-after-font-awesome-']::after, [class*=' iconfont-after-font-awesome-']::after {
  font-family: 'font-awesome', sans-serif;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.iconfont-font-awesome-arrow-up-left::before {
  content: '\EA01';
}
.iconfont-before-font-awesome-arrow-up-left::before {
  content: '\EA01';
}
.iconfont-after-font-awesome-arrow-up-right::after {
  content: '\EA02';
}
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
