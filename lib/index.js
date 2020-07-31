const sdk = require('postman-collection'),
  errors = require('./assets/error'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  fetch = require('node-fetch'),
  languageMap = require('./assets/languageMap.json'),
  generator = require('../sdkgen/nodejs-request').generate; // TODO fix language mapping. this is temporary

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
      description: 'Object of variables to be included and declared in generated sdk'
    }
  };
}

/**
 * Checks and sanitizes optoins provided to sdkgenerator

 * @param {Object} options - options provided to generate method
 */
function checkOptions (options) {
  if (!_.isObject(options)) {
    throw errors.INVALID_PARAMETER;
  }
  if (!options.language) {
    throw errors.INVALID_LANGUAGE;
  }
  if (!options.variant) {
    options.variant = options.language;
  }
  if (options.outputType === 'file' && !options.outputFilePath) {
    throw errors.FILE_PATH_NOT_PROVIDED;
  }
  if (options.variables) {
    if (!_.isObject(options.variables)) { return errors.INVALID_VARIABLE; }
  }
  return options;
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

  let dirname = path.dirname(require.main.filename),

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
    options = checkOptions(options);
    sources = await resolveSources(collection, options.variables);
  }
  catch (error) {
    return callback(error, null);
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
        fs.writeFileSync(path.resolve(dirname, options.outputFilePath), sdkSnippet);
      }
      catch (error) {
        return callback(error, null);
      }
      return callback(null, 'File exported at location: ' + path.resolve(dirname, options.outputFilePath));
    }
    return callback(null, sdkSnippet);
  });
}

module.exports = {
  generate,
  getLanguageList,
  getSDKOptions
};
