const sdk = require('postman-collection'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errors = require('./assets/error'),
  getOutputFileName = (collectionName, extension) => {
    return `${collectionName.split().join('_').toUpperCase()}_SDK.${extension}`;
  };

/**
 * Function to travel postman collection.
 * Uses DFS algorithm so as to maintain folder structure.
 *
 * Accepts two handler/helper methods which can differ for each language
 *  ie; ItemHandler & Itemgroup handler
 *
 * @param {sdk.Collection} collectionItem - CollectionItemMember instance
 * @param {object} options - postman-code-generator options
 * @param {function} ItemHandler - Method which handles Collectionitem if its a {Item}
 * @param {function} ItemGroupHandler - Method which handles Collection Item if its a {ItemGoup}
 */
function processCollection (collectionItem, options, ItemHandler, ItemGroupHandler) {
  if (sdk.Item.isItem(collectionItem)) {
    return new Promise(async (resolve, reject) => {
      try {
        // generates snippet for a pm.Item as per required
        let itemSnippet = await ItemHandler(collectionItem, options);
        return resolve(itemSnippet);
      }
      catch (error) {
        return reject(error);
      }
    });
  }
  return new Promise(async (resolve, reject) => {
    let groupResult = [],
      groupPromises;

    // Mapping all the collection item members to processCollection promise
    // The promise appends the result to groupResult array which is further passed to itemHandler
    // method to generate snippet for a pm.ItemGroup
    groupPromises = collectionItem.items.members.map((element) => {
      return processCollection(element, options, ItemHandler, ItemGroupHandler)
        .then((snippet) => {
          groupResult.push(snippet);
        })
        .catch((error) => {
          return reject(error);
        });
    });
    // resolving all promisses to get sequence correct
    await Promise.all(groupPromises);
    // returning result via ItemGroupHandler
    return resolve(ItemGroupHandler(collectionItem, groupResult));
  });
}

/**
 * Sanitizes input option with global options
 *
 * @param {object} options - object of options for sdkgen
 * @param {Array} optionList - List of possible options to check
 * @returns {object} - sanitized options
 */
function sanitizeOptions (options, optionList) {
  _.forEach(optionList, (option) => {
    if (option.required ? !options[option.id] : false) {
      throw errors.MISSING_OPTION(option.id);
    }
    if (options[option.id]) {
      switch (option.type) {
        case 'string':
          if (!_.isString(options[option.id])) {
            throw errors.INVALUDE_SDKGEN_OPTION_TYPE(option.id, option.type);
          }
          if (!(_.isArray(options.availableOptions) ? option.availableOptions.includes(options[option.id]) : true)) {
            throw errors.INVALID_SDK_OPTION_VALUE(option.id, options[option.id]);
          }
          break;
        case 'boolean':
          if (!_.isBoolean(options[option.id])) {
            throw errors.INVALUDE_SDKGEN_OPTION_TYPE(option.id, option.type);
          }
          break;
        case 'object':
          if (!_.isObject(p[options[option.id]])) {
            throw errors.INVALUDE_SDKGEN_OPTION_TYPE(option.id, option.type);
          }
          break;
        default:
          break;
      }
    }
    else {
      options[option.id] = option.default;
    }
  });
  return options;
}

/**
 * Writes sdk snippet to file
 *
 * @param {string} collectionName - Name of the collection
 * @param {string} snippet - Snippet generated from sdkgenerator
 * @param {string} filepath - path of output file
 * @param {string} extention - file extention
 */
function writeSDKtoFile (collectionName, snippet, filepath, extention) {
  let outputFilePath = filepath;
  if (!path.isAbsolute(outputFilePath)) {
    throw errors.INVALID_OUTPUT_FILE_PATH(outputFilePath);
  }
  if (fs.existsSync(outputFilePath)) {
    if (fs.lstatSync(outputFilePath).isDirectory()) {
      outputFilePath = path.join(outputFilePath, getOutputFileName(collectionName, extention));
    }
  }
  fs.writeFileSync(outputFilePath, snippet);
}

module.exports = {
  processCollection,
  sanitizeOptions,
  writeSDKtoFile
};

