const {processCollection, authorizeCollection} = require('../../../lib/utils'),
  {
    sanitize,
    itemGroupHandler,
    itemHandler,
    getVariableFunction,
    setVariableFunction,
    getClassDoc,
    getRequireList,
    format } = require('./util');

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

  // passing each request in the collection through the authorizer method to add necessary header/query
  authorizeCollection(collection);

  // get require list based on library and auth used in collection
  snippet += getRequireList(collection).join('\n') + '\n\n';

  // initial config variable
  if (options.variableList) {
    snippet += indent + 'const configVariables = {\n';
    options.variableList.each((item) => {
      snippet += indent.repeat(2) + `'${sanitize(item.key)}': '${sanitize(item.value)}',\n`;
    });
    snippet += indent + '};\n\n';
  }

  // class doc
  snippet += getClassDoc(collection, options.variableList);

  // class declaration
  snippet += 'function SDK(config = {}) {\n\n';
  snippet += options.variableList ? 'const self = this;\n\n' : '';
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
  snippet += options.variableList ? 'this.variables = this.setVariables(config);\n\n' : '';
  snippet += '}\n\n';

  // get/set variable methods
  if (options.variableList) {
    snippet += getVariableFunction();
    snippet += setVariableFunction();
  }

  // exporting generated module
  snippet += 'module.exports = SDK;\n';

  try {
    snippet = format(snippet, 2);
  }
  catch (error) {
    return callback(error, null);
  }

  return callback(null, snippet);
}

module.exports = {
  generate
};
