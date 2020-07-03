// TODO add options and fetch options
const processCollection = require('./util').processCollection,
  sanitize = require('./util').sanitize,
  combineVariablesLists = require('../../../lib/utils').combineVariablesLists;

/**
 * Generates sdk for nodejs-request

 * @param {PostmanCollection} collection - Postman collection Instance
 * @param {PostmamVariableList} variables - Postman Variable List with resolved scope
 * @param {Object} options - postman-code-generators options
 * @param {Function} callback - callback functio to return results (err, response)
 * @returns {String} - sdk snippet for input collection
 * TODO add indentation to entire snippet
 */
function generate (collection, variables, options, callback) {
  var snippet = '',
    indent = options.indentType === 'Tab' ? '\t' : ' ';
  indent = indent.repeat(options.indentCount);

  processCollection(collection, options, (err, collectionSnippet) => {
    if (err) {
      return callback(err, null);
    }

    if (options.ES6_enabled) {
      snippet += 'const ';
    }
    else {
      snippet += 'var ';
    }
    snippet += 'request = require(\'request\');\n\n';
    snippet += indent + 'const configVariables = {\n';
    variables.each((item) => {
      snippet += indent.repeat(2) + `'${sanitize(item.key)}': '${sanitize(item.value)}',\n`;
    });
    snippet += indent + '};\n\n';
    snippet += options.ES6_enabled ? 'const ' : 'var ';
    snippet += 'self = this;\n\n';
    snippet += indent + 'this.requests = {\n';
    snippet += collectionSnippet;
    snippet += indent + '};\n\n';
    snippet += '/**\n';
    snippet += 'Function to set environment variables. These variables will override the collection variables\n\n';
    snippet += '@param {Object} env Object containing env variables\n';
    snippet += '*/\n';
    snippet += indent + 'SDK.prototype.setEnvironment = function (env) {\n';
    snippet += indent.repeat(2) + 'let environmentVariables = collectionVariables;\n';
    snippet += indent + 'Object.keys(env).forEach(function (key) {\n';
    snippet += indent.repeat(2) + 'environmentVariables[key] = env[key];\n';
    snippet += indent + '});\n';
    snippet += indent + 'self.environmentVariables = environmentVariables;\n';
    snippet += indent + 'return environmentVariables;\n';
    snippet += indent + '};\n\n';
    snippet += indent + 'this.setEnvironment(environment);\n\n';
    snippet += '}\n\n';
    snippet += 'module.exports = SDK;\n';
    return callback(null, snippet);
  });
}

module.exports = {
  generate
};
