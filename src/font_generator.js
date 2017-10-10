/**
 * @file Generating fonts.
 */
const fs                        = require('fs-extra');
const path                      = require('path');
const SVGIcons2SVGFontStream    = require('svgicons2svgfont');
const fileSorter                = require('svgicons2svgfont/src/filesorter');
const svg2ttf                   = require('svg2ttf');
const ttf2woff                  = require('ttf2woff');
const ttf2woff2                 = require('ttf2woff2');
const ttf2eot                   = require('ttf2eot');

// defines font generator execuging groups
const executingFontGenerators = [
  'svg',
  'ttf',
  [
    'woff',
    'woff2',
    'eot',
  ]
];

// Font generators.
const fontGenerators = {

  // SVG font
  svg: (options) => {

    return new Promise((resolve, reject) => {

      const fontStream    = new SVGIcons2SVGFontStream(options.fontOptions);
      const sortedFiles   = options.files.slice(0).sort((file1, file2) => fileSorter(file1, file2));
      const simpleGlyphs  = [];
      let   fontBuffer    = new Buffer(0);

      // creates directory
      fs.mkdirsSync(options.dest);

      // setting output font destination.
      fontStream.on('data', (data) => {

        fontBuffer = Buffer.concat([fontBuffer, data]);

      }).on('end', () => {

        // append metadata list
        options.glyphs = simpleGlyphs;

        // put font buffer
        options.fontBufferTable.svg = fontBuffer.toString();

        // contains svg format?
        if (options.fontOptions.formats.indexOf('svg') === -1) {

          // returns successful
          resolve();

        } else {

          // output svg file
          const writeStream = fs.createWriteStream(path.resolve(options.dest, `${options.fontOptions.fontName}.svg`));

          // output svg file
          writeStream.on('finish', () => {

            // returns successful
            resolve();

          }).on('error', (error) => {

            // returns error
            reject(error);

          });

          // write buffer
          writeStream.write(fontBuffer);
          writeStream.end();

        }

      }).on('error', (error) => {

        // returns error
        reject(error);

      });


      let currentCodePoint = options.fontOptions.startUnicode;

      // for each files
      sortedFiles.forEach((file) => {

        const glyph   = fs.createReadStream(file);
        const name    = path.basename(file, path.extname(file));
        const unicode = String.fromCharCode(currentCodePoint);

        // set metadata
        const metadata = {
          name,
          unicode: [unicode]
        };

        // append metadata
        glyph.metadata = metadata;

        // write file
        fontStream.write(glyph);

        // append simple glyphs
        simpleGlyphs.push({
          name,
          codepoint: currentCodePoint
        });

        // incremental code point
        currentCodePoint++;

      });

      // close stream
      fontStream.end();

    });

  },

  // TTF font
  ttf: (options) => {

    return new Promise((resolve, reject) => {

      // creates directory
      fs.mkdirsSync(options.dest);

      const writeStream = fs.createWriteStream(path.resolve(options.dest, `${options.fontOptions.fontName}.ttf`));

      // Creates svg2ttf data
      const font       = svg2ttf(options.fontBufferTable.svg, {});
      const fontBuffer = new Buffer(font.buffer);

      // Creates writing buffers
      writeStream.on('finish', () => {

        // put font buffer
        options.fontBufferTable.ttf = fontBuffer;

        // returns successful
        resolve();

      }).on('error', (error) => {

        // returns error
        reject(error);

      });

      // write buffers
      writeStream.write(fontBuffer);
      writeStream.end();

    });

  },

  // WOFF font
  woff: (options) => {

    return new Promise((resolve, reject) => {

      // creates directory
      fs.mkdirsSync(options.dest);

      const writeStream = fs.createWriteStream(path.resolve(options.dest, `${options.fontOptions.fontName}.woff`));

      // Creates ttf2woff data
      const font       = ttf2woff(new Uint8Array(options.fontBufferTable.ttf), {});
      const fontBuffer = new Buffer(font.buffer);

      // Creates writing buffers
      writeStream.on('finish', () => {

        // returns successful
        resolve();

      }).on('error', (error) => {

        // returns error
        reject(error);

      });

      // write buffers
      writeStream.write(fontBuffer);
      writeStream.end();

    });

  },

  // WOFF2 font
  woff2: (options) => {

    return new Promise((resolve, reject) => {

      // creates directory
      fs.mkdirsSync(options.dest);

      const writeStream = fs.createWriteStream(path.resolve(options.dest, `${options.fontOptions.fontName}.woff2`));

      // Creates ttf2woff2 data
      const font       = ttf2woff2(new Uint8Array(options.fontBufferTable.ttf), {});
      const fontBuffer = new Buffer(font.buffer);

      // Creates writing buffers
      writeStream.on('finish', () => {

        // returns successful
        resolve();

      }).on('error', (error) => {

        // returns error
        reject(error);

      });

      // write buffers
      writeStream.write(fontBuffer);
      writeStream.end();

    });

  },

  // EOT font
  eot: (options) => {

    return new Promise((resolve, reject) => {

      // creates directory
      fs.mkdirsSync(options.dest);

      const writeStream = fs.createWriteStream(path.resolve(options.dest, `${options.fontOptions.fontName}.eot`));

      // Creates ttf2eot data
      const font       = ttf2eot(new Uint8Array(options.fontBufferTable.ttf), {});
      const fontBuffer = new Buffer(font.buffer);

      // Creates writing buffers
      writeStream.on('finish', () => {

        // returns successful
        resolve();

      }).on('error', (error) => {

        // returns error
        reject(error);

      });

      // write buffers
      writeStream.write(fontBuffer);
      writeStream.end();

    });

  },

};


/**
 * Execute specified font generator.
 *
 * @param {string} type     font generator type.
 * @param {object} options  font generator options.
 * @returns {Promise} returns Promise of specified font generator.
 */
const executeFontGenerator = (type, options) => {

  const fontGenerator = fontGenerators[type];

  // Exists font generator?
  if (fontGenerator) {

    // executing font generator
    return fontGenerator(options);

  }

  // reject font generator
  return Promise.reject();

};


/**
 * @param {object} options generating options.
 * @returns {Promise} returns glyphs when successed.
 */
module.exports = (options) => {

  const usingOptions = Object.assign({}, options);

  // append buffer table
  usingOptions.fontBufferTable = {};
  usingOptions.fontOptions.log = () => {}; // eslint-disable-line

  return new Promise((resolve, reject) => {

    executingFontGenerators.reduce((prev, current) => {

      return prev.then(() => {

        // current type is Array?
        if (Array.isArray(current)) {

          const promises = current.map((type) => executeFontGenerator(type, usingOptions));

          // parallel executing
          return Promise.all(promises);

        }

        // serial executing
        return executeFontGenerator(current, usingOptions);

      });

    }, Promise.resolve()).then(() => {

      // returns glyphs
      resolve(usingOptions.glyphs);

    }).catch((error) => {

      // returns error
      reject(error);

    });

  });

};
