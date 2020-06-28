const sdk = require('postman-collection'),
  languageMap = require('./assets/languageMap.json'),
  generator = require('../sdkgen/nodejs-request').generate, // TODO fix language mapping. this is temporary
  errors = require('./assets/error'),
  fs = require('fs'),
  path = require('path'),
  fetch = require('node-fetch'),
  _ = require('lodash');
var codeOptions = {
  SDK_enabled: true
};

/**
 * TODO complete this function to get a list of available generators, also create available sdk maintainer
 */
function getLanguageList () {
  return languageMap;
}

/**
 * Returns list of available options for SDK generator
 * TODO look for other options
 */
function getSDKOptions () {
  return {
    outputType: {
      name: 'SDK output type',
      id: 'outputType',
      availableOptions: ['File', 'String'],
      type: 'String',
      default: 'String',
      description: 'Specifies Type of Output for the generated SDK'
    },
    language: {
      name: 'SDK Language',
      id: 'language',
      availableOptions: Object.keys(getLanguageList()),
      type: 'String',
      description: 'Specifies Language for SDK generation'
    },
    variant: {
      name: 'SDK language variant',
      id: 'variant',
      availableOptions: getLanguageList(),
      type: 'String',
      description: 'Specifies Language variant for SDK generation'
    },
    includeReadme: {
      name: 'Includes README with the package if output type is file',
      id: 'includeReadme',
      type: Boolean,
      default: false,
      description: 'Specifies to add or not to add README along with sdk'
    }
  };
}

/**
 * Checks and sanitizes optoins provided to sdkgenerator

 * @param {Object} sdkOptions - sdkOptions provided to generate method
 * @param {Function} callback - Callback function to return results (err, sdkgenoptions);
 */
function checkOptions (sdkOptions, callback) {
  if (!_.isObject(sdkOptions)) {
    return callback(errors.INVALID_PARAMETER, null);
  }
  if (sdkOptions.language === null) {
    return callback(errors.INVALID_LANGUAGE, null);
  }
  if (sdkOptions.variant === null) {
    sdkOptions.variant = sdkOptions.language;
  }
  if (sdkOptions.outputType === 'File' && !sdkOptions.outputFilePath) {
    return callback(errors.FILE_PATH_NOT_PROVIDED, null);
  }
  return callback(null, sdkOptions);
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {Object} source - Source of the collection
 * @param {String} source.type - Collection source type 'string' or 'json'
 * @param {object|string} source.collection - Collection source type 'string' or 'json'
 * @param {Object} sdkOptions - Options for SDK generator
 * @param {String} sdkOptions.language - Specifies language for SDK generator
 * @param {String} sdkOptions.variant - Specifies language variant for SDK generator
 * @param {String} [sdkOptions.outputType] - Output method ie; string/file
 * @param {String} [sdkOptions.outputFilePath] - Output File path for sdk output
 * @param {String} [sdkOptions.includeReadme] - Includes README along with the output.
 * @param {Function} callback - Callback function to return results
 */
function generate (source, sdkOptions, callback) {
  let collection,
    snippet,
    dirname = path.dirname(require.main.filename);

  checkOptions(sdkOptions, (error, sdkopts) => {
    if (error) {
      return callback(error, null);
    }
    sdkOptions = sdkopts;

    if (source.type.toLowerCase() === 'json') {
      if (sdk.Collection.isCollection(source.collection)) {
        collection = source.collection;
      }
      else {
        try {
          collection = new sdk.Collection(source.collection);
        }
        catch (excp) {
          return callback(excp, null);
        }
      }
    }
    else if (source.type.toLowerCase() === 'string') {
      fetch(source.collection)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          console.log(json);
        });
    }
    else {
      return callback(errors.INVALID_COLLECTION_SOURCE, null);
    }

    generator(collection, codeOptions, (err, sdkSnippet) => {
      if (err) {
        return callback(err, null);
      }
      snippet = sdkSnippet;

      if (sdkOptions.outputType === 'File') {
        try {
          fs.writeFileSync(path.resolve(dirname, sdkOptions.outputFilePath), snippet);
        }
        catch (er) {
          return callback(er, null);
        }
        return callback(null, 'File exported at location: ' + path.resolve(dirname, sdkOptions.outputFilePath));
      }
      return callback(null, snippet);
    });
  });
}

module.exports = {
  generate,
  getLanguageList,
  getSDKOptions
};
