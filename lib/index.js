const sdk = require('postman-collection'),
  languageMap = require('./assets/languageMap.json'),
  codegen = require('postman-code-generators'),
  generator = require('../sdkgen/nodejs-request').generate, // TODO fix language mapping. this is temporary
  errors = require('./assets/error'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash');

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

 * @param {Object} sdkOptions - codegenoptions provided to generate method
 * @param {Object} codegenOptions - sdkoptions provided to generate method
 * @param {Function} callback - Callback function to return results (err, sdkgenoptions, codegenoptions);
 */
function checkOptions (sdkOptions, codegenOptions, callback) {
  // checks for sdkgenerator
  if (!_.isObject(sdkOptions)) {
    return callback(errors.INVALID_PARAMETER, null, null);
  }
  if (sdkOptions.language === null) {
    return callback(errors.INVALID_LANGUAGE, null, null);
  }
  if (sdkOptions.variant === null) {
    sdkOptions.variant = sdkOptions.language;
  }
  if (sdkOptions.outputType === 'File' && !sdkOptions.outputFilePath) {
    return callback(errors.FILE_PATH_NOT_PROVIDED, null, null);
  }
  // checks for codegenerator
  if (!_.isObject(codegenOptions) || codegenOptions === null) {
    return callback(errors.INVALID_PARAMETER, null, null);
  }
  if (_.isEmpty(codegenOptions)) {
    codegenOptions.SDKGEN_enabled = true;
  }
  return callback(null, sdkOptions, codegenOptions);
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
 * @param {Object} [codeOptions] - Options for code generator
 * @param {Number} [codeOptions.indentType] - indentation based on Tab or spaces
 * @param {Number} [codeOptions.indentCount] - count/frequency of indentType
 * @param {Number} [codeOptions.requestTimeout] : time in milli-seconds after which request will bail out
 * @param {Boolean} [codeOptions.trimRequestBody] : whether to trim request body fields
 * @param {Boolean} [codeOptions.addCacheHeader] : whether to add cache-control header to postman SDK-request
 * @param {Boolean} [codeOptions.followRedirect] : whether to allow redirects of a request
 * @param {Function} callback - Callback function to return results
 */
function generate (source, sdkOptions, codeOptions, callback) {
  let collection,
    snippet,
    dirname = path.dirname(require.main.filename);
  checkOptions(sdkOptions, codeOptions, (error, sdkopts, codegenopts) => {
    if (error) {
      return callback(error, null);
    }
    sdkOptions = sdkopts;
    codeOptions = codegenopts;

    if (source.type.toLowerCase() === 'json') {
      if (sdk.Collection.isCollection(source.collection)) {
        collection = source.collection;
      }
      else {
        collection = new sdk.Collection(source.collection);
      }
    }
    else if (source.type.toLowerCase() === 'string') {
      // TODO process string type here for files and urls
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
  getSDKOptions,
  getCodegenOptions: codegen.getOptions
};
