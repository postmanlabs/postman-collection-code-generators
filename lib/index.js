const sdk = require('postman-collection'),
  errors = require('./assets/error'),
  _ = require('lodash'),
  fetch = require('node-fetch'),
  sanitizeOptions = require('./utils').sanitizeOptions,
  writeSDK = require('./utils').writeSDKtoFile,
  sdkgens = require('./assets/sdkgens'),
  globalOptions = require('./assets/sdkOptions');

/**
 * Returns list of supporting languages for SDK generator
 */
function getLanguageList () {
  let languageList = sdkgens.map((gen) => {
    return {
      name: gen.name,
      language: gen.language,
      variant: gen.variant
    };
  });
  return languageList;
}

/**
 * Returns list of available options for SDK generator
 *
 * @param {string} [language] - Language
 * @param {string} [variant] - Variant
 * @param {function} callback - callback to return results
 */
function getSDKOptions (language, variant, callback) {
  if (_.isFunction(language)) {
    callback = language;
    return callback(null, globalOptions);
  }
  let options;
  _.forEach(sdkgens, (element) => {
    if (element.language === language.toLowerCase() &&
      element.variant === (variant ? variant.toLowerCase() : '')) {
      options = element.module.getOptions();
    }
  });
  return options ? callback(null, options) : callback(errors.INVALID_VAIRIANT);
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {Object} input - Source of the collection
 * @param {String} input.type - Collection source type, 'string' or 'json' or 'url'
 * @param {object|string} input.data - Collection source type 'string' or 'json'
 * @param {Object} options - Options for SDK generator
 * @param {String} options.language - Specifies language for SDK generator
 * @param {String} options.variant - Specifies language variant for SDK generator
 * @param {String} [options.outputType] - Output method ie; string/file
 * @param {String} [options.outputFilePath] - Output File path for sdk output
 * @param {boolean} [options.includeReadme] - Includes README along with the output.
 * @param {object} [options.variables] - Variables to be included in SDK
 * @param {Function} callback - Callback function to return results
 * @example
 *  generate({
 *    type: 'json',
 *    data: require('./collection.json')
 *  }, {
 *    language: 'Nodejs',
 *    variant: 'Request',
 *    variables: {
 *      variable1: value1
 *      variable2: value2
 *    },
 *    outputType: 'string'
 *  });
 */
async function generate (input, options, callback) {

  if (!input.type || !input.data) {
    return callback(errors.INVALID_COLLECTION_SOURCE, null);
  }

  let sdkgen, sdkGenerator,

    /**
     * Resolves input & variable sources and returns collection and variableList
     *
     * @param {object|sdk.Collection} input
     * @param {object} variables
     */
    resolveSources = async (input, variables) => {
      let collection, variableList;

      /**
       * Resolving collection Sources
       */
      if (input.type.toLowerCase() === 'json') {
        try {
          collection = sdk.Collection.isCollection(input.data) ?
            input.data :
            new sdk.Collection(input.data);
        }
        catch (error) {
          throw errors.INVALID_COLLECTION_SOURCE;
        }
      }
      else if (input.type.toLowerCase() === 'url') {
        let fetchedCollection;
        try {
          fetchedCollection = await fetch(input.data);
          fetchedCollection = await fetchedCollection.json();
          collection = sdk.Collection.isCollection(fetchedCollection) ? fetchedCollection :
            new sdk.Collection(fetchedCollection);
        }
        catch (error) {
          throw errors.INVALID_COLLECTION_SOURCE;
        }
      }
      else if (input.type.toLowerCase() === 'string') {
        try {
          collection = JSON.parse(input.data);
        }
        catch (e) {
          throw errors.INVALID_COLLECTION_SOURCE;
        }
      }

      /**
       * Resolving variable sources
       */
      if (variables) {
        variableList = [];
        Object.keys(variables).forEach((variableKey) => {
          variableList.push({
            key: variableKey,
            value: variables[variableKey]
          });
        });
        variableList = variableList.length ? new sdk.VariableList(null, variableList) : undefined;
      }
      return {variables: variableList, collection: collection};
    },
    sources;

  try {
    sanitizeOptions(options, globalOptions);
    sources = await resolveSources(input, options.variables);
  }
  catch (error) {
    return callback({
      error,
      result: false
    });
  }

  _.forEach(sdkgens, (element) => {
    if (element.language === options.language.toLowerCase() &&
      element.variant === options.variant.toLowerCase()) {
      sdkGenerator = element;
      sdkgen = sdkGenerator.module;
    }
  });

  if (!sdkgen) {
    return callback(errors.UNKNOWN_SDKGEN(options.language, options.variant), null);
  }

  sdkgen.generate(sources.collection, {
    variableList: sources.variables,
    ...options
  }, (err, sdkSnippet) => {
    if (err) {
      return callback({
        error: err,
        result: false
      });
    }

    if (options.outputType.toLowerCase() === 'file') {
      try {
        writeSDK(sources.collection.name, sdkSnippet, options.outputFilePath, sdkGenerator.extension);
      }
      catch (error) {
        return callback({
          error: error,
          result: false
        });
      }
      return callback(null, 'SDK generated.');
    }
    return callback(null, {
      result: true,
      data: sdkSnippet
    });
  });
}

module.exports = {
  generate,
  getLanguageList,
  getSDKOptions
};
