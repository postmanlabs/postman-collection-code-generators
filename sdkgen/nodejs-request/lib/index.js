// TODO add options and fetch options
const processCollection = require('../../../lib/utils').processCollection,
  { sanitize, itemGroupHandler, itemHandler, getVariableFunctions, getClassDoc} = require('./util');

/**
 * Generates sdk for nodejs-request

 * @param {PostmanCollection} collection - Postman collection Instance
 * @param {Object} options - postman-sdk-generators options
 * @param {Object} [options.variableList] - variableList to be declared in generated sdk
 * @param {Function} callback - callback functio to return results (err, response)
 * @returns {String} - sdk snippet for input collection
 * TODO add indentation to entire snippet
 */
async function generate (collection, options, callback) {
  var snippet = '',
    collectionMember = collection.items.members,
    indent = options.indentType === 'Tab' ? '\t' : ' ';

  indent = indent.repeat(options.indentCount);

  if (options.ES6_enabled) {
    snippet += 'const ';
  }
  else {
    snippet += 'var ';
  }
  snippet += 'request = require(\'request\');\n\n';

  // initial config variable
  snippet += indent + 'const configVariables = {\n';
  if (options.variableList) {
    options.variableList.each((item) => {
      snippet += indent.repeat(2) + `'${sanitize(item.key)}': '${sanitize(item.value)}',\n`;
    });
  }
  snippet += indent + '};\n\n';

  // class doc
  snippet += getClassDoc(collection, options.variableList);

  // class declaration
  snippet += 'function SDK(config) {\n\n';
  snippet += options.ES6_enabled ? 'const ' : 'var ';
  snippet += 'self = this;\n\n';
  // Performing first layer individually to avoid adding additional layer to result
  await Promise.all(collectionMember.map((child) => {
    return processCollection(child, options, itemHandler, itemGroupHandler)
      .then((str) => {
        snippet += str;
      })
      .catch((error) => {
        callback(error, null);
      });
  }));
  snippet += indent + 'this.variables = this.setVariables(config);\n\n';
  snippet += '}\n\n';

  // get/set variable methods
  snippet += getVariableFunctions();

  return callback(null, snippet);
}

module.exports = {
  generate
};
