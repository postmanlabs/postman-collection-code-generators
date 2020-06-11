// TODO add options and fetch options
const sdk = require('postman-collection'),
    {
        getLanguageList
    } = require('postman-code-generators'),
    getCodegenOptions = require('postman-code-generators').getOptions,
    processCollection = require('./util').processCollection;
_ = require('lodash');

/**
 * Generates sdk for nodejs-request

 * @param {PostmanCollection} collection - Postman collection Instance
 * @param {Object} options - postman-code-generators options
 * @param {Function} callback - callback functio to return results (err, response)
 * @returns {String} - sdk snippet for input collection
 * TODO add indentation to entire snippet
 */
async function generate (collection, options, callback) {
    var snippet = '',
        collectionVariables = collection.variables.members.length ? collection.variables.members : [],
        // sdkname = collection.name.split(' ').join('_'),
        sdkname = 'SDKNAME',
        indent = options.indentType === 'Tab' ? '\t' : ' ';
    indent = indent.repeat(options.indentCount);
    if (options.ES6_enabled) {
        snippet += 'const ';
    }
    else {
        snippet += 'var ';
    }
    snippet += 'request = require(\'request\');\n';
    snippet += `function ${sdkname}(environment) {\n`;
    snippet += indent + 'this.requests = {\n';
    try {
        snippet += await processCollection(collection, options, 1);
    }
    catch (error) {
        return callback(error, null);
    }
    snippet += indent + '};\n';
    snippet += indent + 'this.variables = {\n';
    await collectionVariables.forEach((item) => {
        snippet += indent.repeat(2) + `${item.key}: '${item.value}',\n`;
    });
    snippet += indent + '}\n';
    snippet += indent + `${sdkname}.prototype.setVariabes = function(variables) {\n`;
    snippet += indent.repeat(2) + 'Object.keys(variables).forEach((key) => {\n';
    snippet += indent.repeat(3) + 'this.variables[key] = variables.key;\n';
    snippet += indent.repeat(2) + '});\n';
    snippet += indent + '}\n';
    snippet += '}\n';
    return callback(null, snippet);
}

/**
 * Gives a list of possible options for nodejs-request sdk generator
 * TODO update and test this function
 */
function getOptions () {
    var result;
    getCodegenOptions('NodeJs', 'Request', (err, codegenOptions) => {
        if (err) {
            result = err;
            return;
        }
        result = codegenOptions;
    });
    return result;
}

module.exports = {
    generate,
    getOptions
};