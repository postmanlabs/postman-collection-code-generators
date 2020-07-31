// TODO add options and fetch options
const processCollection = require('../../../lib/utils').processCollection,
  { sanitize, itemGroupHandler, itemHandler} = require('./util');

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
    indent = options.indentType === 'Tab' ? '\t' : ' ';
  indent = indent.repeat(options.indentCount);

  if (options.ES6_enabled) {
    snippet += 'const ';
  }
  else {
    snippet += 'var ';
  }
  snippet += 'request = require(\'request\');\n\n';
  snippet += indent + 'const configVariables = {';
  if (options.variableList) {
    options.variableList.each((item) => {
      snippet += indent.repeat(2) + `'${sanitize(item.key)}': '${sanitize(item.value)}',\n`;
    });
  }
  snippet += indent + '};\n\n';
  snippet += 'function SDK(environment = {}) {\n\n';
  snippet += options.ES6_enabled ? 'const ' : 'var ';
  snippet += 'self = this;\n\n';
  snippet += indent + 'this.requests = {\n';
  try {
    snippet += await processCollection(collection, options, itemHandler, itemGroupHandler);
  }
  catch (err) {
    return callback(err, null);
  }
  snippet += indent + `}.${collection.name};\n\n`;
  snippet += indent + 'this.variables = this.setVariables(environment);\n\n';
  snippet += '}\n\n';
  snippet += '/**\n';
  snippet += 'Function to set environment variables. These variables will override the collection variables\n\n';
  snippet += '@param {Object} env Object containing env variables\n';
  snippet += '*/\n';
  snippet += indent + 'SDK.prototype.setVariables = function (vars) {\n';
  snippet += indent.repeat(2) + 'let variables = JSON.parse(JSON.stringify(this.variables || configVariables));\n';
  snippet += indent + 'Object.keys(vars).forEach(function (key) {\n';
  snippet += indent.repeat(2) + 'variables[key] = vars[key];\n';
  snippet += indent + '});\n';
  snippet += indent + 'this.variables = variables;\n';
  snippet += indent + 'return this.variables;\n';
  snippet += indent + '};\n\n';
  snippet += '/**\n';
  snippet += 'Method to retrieve current variable config\n\n';
  snippet += '@param {any} [var] - variable name to return \n';
  snippet += '@returns {Object} object containing variables\n';
  snippet += '*/\n';
  snippet += indent + 'SDK.prototype.getVariables = function (variable) {\n';
  snippet += indent + 'return variable ? this.variables[variable] : this.variables;\n';
  snippet += indent + '};\n\n';
  snippet += 'module.exports = SDK;\n';
  return callback(null, snippet);
}

module.exports = {
  generate
};
