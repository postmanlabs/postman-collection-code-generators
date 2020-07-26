const sdk = require('postman-collection'),
  errors = require('./assets/error'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  fetch = require('node-fetch'),
  languageMap = require('./assets/languageMap.json'),
  generator = require('../sdkgen/nodejs-request').generate; // TODO fix language mapping. this is temporary
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
      name: 'SDK Variables',
      id: 'variables',
      type: Object,
      description: 'Specifies environment/global variables for the sdk generation'
    }
  };
}

/**
 * Checks and sanitizes optoins provided to sdkgenerator

 * @param {Object} sdkOptions - sdkOptions provided to generate method
 */
function checkOptions (sdkOptions) {
  if (!_.isObject(sdkOptions)) {
    throw errors.INVALID_PARAMETER;
  }
  if (!sdkOptions.language) {
    throw errors.INVALID_LANGUAGE;
  }
  if (!sdkOptions.variant) {
    sdkOptions.variant = sdkOptions.language;
  }
  if (sdkOptions.outputType === 'file' && !sdkOptions.outputFilePath) {
    throw errors.FILE_PATH_NOT_PROVIDED;
  }
  if (sdkOptions.variables) {
    if (!_.isObject(sdkOptions.variables)) { return errors.INVALID_VARIABLE; }
  }
  return sdkOptions;
  // return callback(null, sdkOptions);
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
 * @param {Object} [sdkOptions.variables] - Variables to be included in SDK
 * @param {Function} callback - Callback function to return results
 */
async function generate (collection, sdkOptions, callback) {
  let dirname = path.dirname(require.main.filename),

    /**
     * Resolves input collection & variable sources and returns collection and variableList instance
     *
     * @param {object|sdk.Collection} collection
     * @param {Array.<{type: String, source: Object}>} variables
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
      else {
        throw errors.INVALID_COLLECTION_SOURCE;
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
    sdkOptions = checkOptions(sdkOptions);
    sources = await resolveSources(collection, sdkOptions.variables || undefined);
  }
  catch (error) {
    return callback(error, null);
  }


  generator(sources.collection, sources.variables, codeOptions, (err, sdkSnippet) => {
    if (err) {
      return callback(err, null);
    }

    if (sdkOptions.outputType === 'file') {
      try {
        fs.writeFileSync(path.resolve(dirname, sdkOptions.outputFilePath), sdkSnippet);
      }
      catch (error) {
        return callback(error, null);
      }
      return callback(null, 'File exported at location: ' + path.resolve(dirname, sdkOptions.outputFilePath));
    }
    return callback(null, sdkSnippet);
  });
}

module.exports = {
  generate,
  getLanguageList,
  getSDKOptions
};
