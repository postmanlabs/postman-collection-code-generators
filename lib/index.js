const sdk = require('postman-collection'),
  languageMap = require('./assets/languageMap.json'),
  generator = require('../sdkgen/nodejs-request').generate, // TODO fix language mapping. this is temporary
  errors = require('./assets/error'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash');
var codeOptions = {
  SDKGEN_enabled: true
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
    },
    variables: {
      name: 'Postman Variable',
      id: 'variables',
      type: Object,
      default: false,
      description: 'Specifies environment/global variables for the sdk generation'
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
  if (sdkOptions.outputType === 'file' && !sdkOptions.outputFilePath) {
    return callback(errors.FILE_PATH_NOT_PROVIDED, null);
  }
  if (sdkOptions.variables) {
    if (!sdkOptions.variables.type || !sdkOptions.variables.source) {
      return callback(errors.INVALID_VARIABLES, null);
    }
  }
  return callback(null, sdkOptions);
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {Object} collection - Source of the collection
 * @param {String} collection.type - Collection source type, 'string' or 'json'
 * @param {object|string} collection.source - Collection source type 'string' or 'json'
 * @param {Object} sdkOptions - Options for SDK generator
 * @param {String} sdkOptions.language - Specifies language for SDK generator
 * @param {String} sdkOptions.variant - Specifies language variant for SDK generator
 * @param {String} [sdkOptions.outputType] - Output method ie; string/file
 * @param {String} [sdkOptions.outputFilePath] - Output File path for sdk output
 * @param {String} [sdkOptions.includeReadme] - Includes README along with the output.
 * @param {Object} [sdkOptions.variables] - Postman Variables
 * @param {String} [sdkOptions.variables.type] - Postman Variables input type, 'json' or 'string'
 * @param {object|string} [sdkOptions.variables.source] - Source of Postman Variables, json or url
 * @param {Function} callback - Callback function to return results
 * TODO use async lib to make these function calls
 */
function generate (collection, sdkOptions, callback) {
  let postmanCollection = null,
    postmanVariables = null,
    dirname = path.dirname(require.main.filename);

  checkOptions(sdkOptions, (error, sdkopts) => {
    if (error) {
      return callback(error, null);
    }
    sdkOptions = sdkopts;

    if (collection.type.toLowerCase() === 'json') {
      try {
        postmanCollection = sdk.Collection.isCollection(collection.source) ?
          collection.source :
          new sdk.Collection(collection.source);
      }
      catch (excp) {
        return callback(excp, null);
      }
    }
    else if (collection.type.toLowerCase() === 'string') {
      // TODO Complete this collection fetch from string
    }
    else {
      return callback(errors.INVALID_COLLECTION_SOURCE, null);
    }

    if (sdkOptions.variables) {
      if (sdkOptions.variables.type.toLowerCase() === 'json') {
        try {
          postmanVariables = sdk.PropertyList.isPropertyList(sdkOptions.variables.source) ?
            sdk.variables.source :
            new sdk.VariableList(null, sdkOptions.variables.source.values);
        }
        catch (excp) {
          return callback(excp, null);
        }
      }
      else if (sdkOptions.variables.type.toLowerCase() === 'string') {
        // TODO Complete this variable fetch from url
      }
      else {
        return callback(errors.INVALID_VARIABLES, null);
      }
    }

    generator(postmanCollection, postmanVariables, codeOptions, (err, sdkSnippet) => {
      if (err) {
        return callback(err, null);
      }

      if (sdkOptions.outputType === 'file') {
        try {
          fs.writeFileSync(path.resolve(dirname, sdkOptions.outputFilePath), sdkSnippet);
        }
        catch (er) {
          return callback(er, null);
        }
        return callback(null, 'File exported at location: ' + path.resolve(dirname, sdkOptions.outputFilePath));
      }
      return callback(null, sdkSnippet);
    });
  });
}

module.exports = {
  generate,
  getLanguageList,
  getSDKOptions
};
