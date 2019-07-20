/**
 * @file Generate iconfonts from stylesheets - rulesets
 */
const postcss           = require('postcss');
const path              = require('path');
const glob              = require('glob');
const stringTemplate    = require('string-template');
const fontGenerator     = require('./font_generator');


// Templates src property by font type
const srcPropertyTemplates = {

  eotIE: 'url(\'{fontPath}.eot{fontHash}\')',
  eot: 'url(\'{fontPath}.eot{fontHash}#iefix\') format(\'embedded-opentype\')',
  woff2: 'url(\'{fontPath}.woff2{fontHash}\') format(\'woff2\')',
  woff: 'url(\'{fontPath}.woff{fontHash}\') format(\'woff\')',
  ttf: 'url(\'{fontPath}.ttf{fontHash}\') format(\'truetype\')',
  svg: 'url(\'{fontPath}.svg{fontHash}#${fontName}\') format(\'svg\')',

};


/**
 * Get template font hash string.
 *
 * @param {string} fontHash use fontHash
 */
const getTemplateFontHash = (fontHash) => {

  return fontHash ? `?${fontHash}` : '';

};


/**
 * Creates icon fonts.
 *
 * @param {object} iconFont   icon font options.
 * @param {object} rulesets   Rulesets of PostCSS object.
 * @param {object} options    web font options.
 * @returns {Promise} returns glyphs when successed.
 */
const createFonts = (iconFont, rulesets, options) => {

  // Empty font src?
  if (!iconFont.src) {

    // noop
    return Promise.resolve();

  }

  const files   = [].concat(glob.sync(iconFont.src));

  // Empty files?
  if (files.length === 0) {

    // noop
    return Promise.resolve();

  }

  return new Promise((resolve, reject) => {

    fontGenerator({
      files,
      dest: path.resolve(options.outputPath),
      cachePath: options.cachePath,
      fontOptions: {
        formats: options.formats,
        fontName: iconFont.fontName,
        fontHeight: options.fontHeight,
        ascent: options.ascent,
        descent: options.descent,
        normalize: options.normalize,
        centerHorizontally: options.centerHorizontally,
        fixedWidth: options.fixedWidth,
        fixedHash: options.fixedHash,
        startUnicode: options.startUnicode,
        prependUnicode: options.prependUnicode,
      }
    }).then((glyphs) => {

      resolve(glyphs);

    }).catch((error) => {

      reject(error);

    });

  });

};


/**
 * Creates font-face src property.
 *
 * @param {object} iconFont icon font properties.
 * @param {object} options  options of generating fonts.
 * @returns {string} font-face src property.
 */
const createFontFaceSrcProperty = (iconFont, options) => {

  // Creates font path
  const fontPath = path.relative(
    path.resolve(options.publishPath, options.stylesheetPath),
    path.join(options.outputPath, iconFont.fontName)
  ).replace(/\\/g, path.posix.sep);

  const srcFormats = [];

  // for each formats
  options.formats.forEach((format) => {

    const template = srcPropertyTemplates[format];

    // Is not empty template?
    if (template) {

      srcFormats.push(stringTemplate(template, {
        fontPath,
        fontHash: getTemplateFontHash(iconFont.fontHash),
        fontName: iconFont.fontName
      }));

    }

  });

  // returns src property
  return srcFormats.join(', ');

};


/**
 * Creates font-face src property with EOT.
 *
 * @param {object} iconFont icon font properties.
 * @param {object} options  options of generating fonts.
 * @returns {string} font-face src property.
 */
const createFontFaceSrcPropertyWithEOT = (iconFont, options) => {

  // Creates font path
  const fontPath = path.relative(
    path.resolve(options.publishPath, options.stylesheetPath),
    path.join(options.outputPath, iconFont.fontName)
  );

  // returns src property
  return stringTemplate(srcPropertyTemplates.eotIE, {
    fontPath,
    fontHash: getTemplateFontHash(iconFont.fontHash),
    fontName: iconFont.fontName
  });

};

/**
 * Creates rulesets of web font.
 *
 * @param {string}  iconFont    target icon font.
 * @param {object}  rulesets    Rulesets of PostCSS object.
 * @param {object}  glyphs      glyphs of web font.
 * @param {object}  options     generating font options.
 */
const createWebFontRuleSets = (iconFont, rulesets, glyphs, options) => {

  // inserts new src property
  rulesets.fontFaceRule.insertAfter(iconFont.srcDecl, postcss.decl({
    prop: 'src',
    value: createFontFaceSrcProperty(iconFont, options)
  }));

  // No contains eot format?
  if (options.formats.indexOf('eot') === -1) {

    // Remove src property
    iconFont.srcDecl.remove();

  } else {

    // Replace src property
    iconFont.srcDecl.replaceWith({
      prop: 'src',
      value: createFontFaceSrcPropertyWithEOT(iconFont, options)
    });

  }

  // creates class prefix names
  const useClassNamePrefix = options.classNamePrefix ? `${options.classNamePrefix}-` : '';
  const useClassNamePrefixBefore = options.classNamePrefixBefore ? `${options.classNamePrefixBefore}-` : '';
  const useClassNamePrefixAfter = options.classNamePrefixAfter ? `${options.classNamePrefixAfter}-` : '';

  // append base ruleset
  const iconRule = postcss.rule({
    selectors: [
      `[class^='${useClassNamePrefix}${iconFont.fontName}-']::before`,
      `[class*=' ${useClassNamePrefix}${iconFont.fontName}-']::before`,
      `[class^='${useClassNamePrefix}${useClassNamePrefixBefore}${iconFont.fontName}-']::before`,
      `[class*=' ${useClassNamePrefix}${useClassNamePrefixBefore}${iconFont.fontName}-']::before`,
      `[class^='${useClassNamePrefix}${useClassNamePrefixAfter}${iconFont.fontName}-']::after`,
      `[class*=' ${useClassNamePrefix}${useClassNamePrefixAfter}${iconFont.fontName}-']::after`,
    ]
  });
  iconRule.append({
    prop: 'font-family',
    value: `'${iconFont.fontName}', sans-serif`
  },
  {
    prop: 'font-style',
    value: 'normal'
  },
  {
    prop: 'font-weight',
    value: 'normal'
  },
  {
    prop: 'font-variant',
    value: 'normal'
  },
  {
    prop: 'text-transform',
    value: 'none'
  },
  {
    prop: 'line-height',
    value: '1'
  },
  {
    prop: 'vertical-align',
    value: `${options.verticalAlign}`
  },
  {
    prop: '-webkit-font-smoothing',
    value: 'antialiased'
  },
  {
    prop: '-moz-osx-font-smoothing',
    value: 'grayscale'
  }
  );
  rulesets.root.insertAfter(rulesets.fontFaceRule, iconRule);


  let baseRule = iconRule;

  // append glyphs
  glyphs.forEach((glyph) => {

    [
      {
        prefix: useClassNamePrefix,
        pseudo: 'before',
      },
      {
        prefix: `${useClassNamePrefix}${useClassNamePrefixBefore}`,
        pseudo: 'before',
      },
      {
        prefix: `${useClassNamePrefix}${useClassNamePrefixAfter}`,
        pseudo: 'after',
      },
    ].forEach((classNamingConvention) => {

      const fontRule = postcss.rule({
        selector: `.${classNamingConvention.prefix}${iconFont.fontName}-${glyph.name}::${classNamingConvention.pseudo}`,
      });
      fontRule.append({
        prop: 'content',
        value: `'\\${glyph.codepoint.toString(16).toUpperCase()}'`
      });

      // insert ruleset
      rulesets.root.insertAfter(baseRule, fontRule);

      // replace base ruleset
      baseRule = fontRule;

    });

  });

};


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

        // creates rulesets
        createWebFontRuleSets(iconFont, rulesets, fontResult.glyphs, options);

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
