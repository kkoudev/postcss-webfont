/**
 * @file Generate iconfonts from stylesheets - rulesets
 */
const postcss           = require('postcss');
const path              = require('path');

const createFonts           = require('./createFonts');
const createWebFontRuleSets = require('./createWebFontRuleSets');



/**
 * Parsing font-face rulesets.
 *
 * @param {object}  rulesets  Rulesets of PostCSS object.
 * @param {object}  options   Generating font options.
 * @returns {Promise} promise object.
 */
const processFontFace = (rulesets, options) => {

  return new Promise((resolve, reject) => {

    const iconFont = {};

    // Get 'font-family' property.
    rulesets.fontFaceRule.walkDecls('font-family', (decl) => {

      // set value as font name
      iconFont.fontName = decl.value.replace(/^['"]?/, '').replace(/['"]?$/, '');

    });

    // Get 'src' property.
    rulesets.fontFaceRule.walkDecls('src', (decl) => {

      const matcher = decl.value.match(/^url\(['"]?(.*\.svg)['"]?\)/);

      // match src property
      if (matcher) {

        // Absolute url?
        if (/^\//.test(matcher[1])) {

          iconFont.src = path.resolve(options.basePath + matcher[1]);

        } else {

          iconFont.src = path.resolve(path.dirname(rulesets.root.source.input.file), matcher[1]);

        }

      }

      // set target src
      iconFont.srcDecl = decl;

    });

    // creates fonts
    createFonts(iconFont, rulesets, options).then((fontResult) => {

      // creates rulesets
      if (fontResult) {

        // Select cachebuster time option.
        if (options.cachebuster !== null && options.cachebuster !== undefined) {

          const useCachebuster = options.cachebuster.toString().toLowerCase();

          // Select cachebuster option
          switch (useCachebuster) {

            // hash cachebuster
            case 'hash':
              iconFont.fontHash = fontResult.svgHash;
              break;

            // fixed cachebuster
            case 'fixed':
              iconFont.fontHash = options.cachebusterFixed;
              break;

            // Disable cachebuster
            default:
              iconFont.fontHash = null;
              break;

          }

        } else {

          // Disable cachebuster
          iconFont.fontHash = null;

        }
        const glyphs = fontResult.glyphs
          .map(glyph => ({
            name: glyph.name,
            content: `'\\${glyph.codepoint.toString(16).toUpperCase()}'`
          }))
          .map(options.glyphNormalizer);

        // creates rulesets
        createWebFontRuleSets(iconFont, rulesets, glyphs, options);

      }

      // returns successful
      resolve();

    }).catch((error) => {

      // returns error
      reject(error);

    });

  });

};


/**
 * Process generating rulesets of web fonts.
 *
 * @param {object} root     root of PostCSS.
 * @param {object} options  options of generating fonts.
 * @returns {Promise} promise object.
 */
module.exports = (root, options) => {

  return new Promise((resolve, reject) => {

    const fontFaceProcesses = [];

    // for each font face rule
    root.walkAtRules('font-face', (rule) => {

      // append font face processing
      fontFaceProcesses.push(() => {

        return processFontFace({ root, fontFaceRule: rule }, options);

      });

    });

    // serial executing processing
    fontFaceProcesses.reduce((prev, current) => {

      return prev.then(() => current());

    }, Promise.resolve()).then(() => {

      // returns successful
      resolve();

    }).catch((error) => {

      // returns error
      reject(error);

    });

  });

};
