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


### fontDisplay

The font-display property value.

Type: `String`

Default: `swap`


### verticalAlign

The vertical-align property value.

Type: `String`

Default: `middle`


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
}

[class^='iconfont-font-awesome-']::before, [class*=' iconfont-font-awesome-']::before,
[class^='iconfont-before-font-awesome-']::before, [class*=' iconfont-before-font-awesome-']::before,
[class^='iconfont-after-font-awesome-']::after, [class*=' iconfont-after-font-awesome-']::after {
  font-family: 'font-awesome';
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  font-display: swap;
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
