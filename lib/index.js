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
 * @returns {array} - array of available options for input language/variant | global options
 */
function getSDKOptions (language, variant) {
  if (language || variant) {
    let options = [];
    _.forEach(sdkgens, (element) => {
      if (element.language === language.toLowerCase() &&
        element.variant === (variant ? variant.toLowerCase() : null)) {
        options = [
          ...globalOptions,
          ...element.module.getOptions()
        ];
      }
    });
    return options;
  }
  return globalOptions;
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {Object} collection - Source of the collection
 * @param {String} collection.type - Collection source type, 'string' or 'json'
 * @param {object|string} collection.source - Collection source type 'string' or 'json'
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
 *    source: require('./collection.json')
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
async function generate (collection, options, callback) {

  if (!collection.type || !collection.source) {
    return callback(errors.INVALID_COLLECTION_SOURCE, null);
  }

  let sdkgen, sdkGenerator,

    /**
     * Resolves input collection & variable sources and returns collection and variableList instance
     *
     * @param {object|sdk.Collection} collection
     * @param {object} variables
     */
    resolveSources = async (collection, variables) => {
      let collectionInstance, variableList;

      /**
       * Resolving collection Sources
       */
      if (collection.type.toLowerCase() === 'json') {
        try {
          collectionInstance = sdk.Collection.isCollection(collection.source) ?
            collection.source :
            new sdk.Collection(collection.source);
        }
        catch (error) {
          throw errors.INVALID_COLLECTION_SOURCE;
        }
      }
      else if (collection.type.toLowerCase() === 'string') {
        let fetchedCollection;
        try {
          fetchedCollection = await fetch(collection.source);
          fetchedCollection = await fetchedCollection.json();
          collectionInstance = sdk.Collection.isCollection(fetchedCollection) ? fetchedCollection :
            new sdk.Collection(fetchedCollection);
        }
        catch (error) {
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
        variableList = new sdk.VariableList(null, variableList);
      }
      return {variables: variableList, collection: collectionInstance};
    },
    sources;

  try {
    sanitizeOptions(options, globalOptions);
    sources = await resolveSources(collection, options.variables);
  }
  catch (error) {
    return callback(error, null);
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

  generator(sources.collection, {
    variableList: sources.variables,
    ...options
  }, (err, sdkSnippet) => {
    if (err) {
      return callback(err, null);
    }

    if (options.outputType === 'file') {
      try {
        writeSDK(sources.collection.name, sdkSnippet, options.outputFilePath, sdkGenerator.extension);
      }
      catch (error) {
        return callback(error, null);
      }
      return callback(null, 'SDK generated.');
    }
    return callback(null, sdkSnippet);
  });
}

module.exports = {
  generate,
  getLanguageList,
  getSDKOptions
};
