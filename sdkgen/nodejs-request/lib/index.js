//TODO add options and fetch options
const sdk = require('postman-collection'),
    { getLanguageList} = require('postman-code-generators'),
    getCodegenOptions = require('postman-code-generators').getOptions,
    processCollection = require('./util').processCollection;
    _ = require('lodash');

/**
 * Generates sdk for nodejs-request
 * @param {PostmanCollection} collection - Postman collection Instance
 * @param {Object} options - postman-code-generators options
 * @returns {String} - sdk snippet for input collection
 * TODO add indentation to entire snippet
 */
async function generate(collection, options, callback){
    var snippet = '',
        collectionVariables = collection.variables ? collection.variables : [],
        sdkname = collection.name.split(' ').join('_') ;
    if(options.ES6_enabled){
        snippet += 'const ';
    }
    else{
        snippet += 'var ';
    }
    snippet += 'request = require(\'nodejs-request\');\n';
    snippet += `function ${sdkname}() {\n`;
    snippet += 'this.requests = {\n';
    try{
        snippet += await processCollection(collection, options,1);
    }
    catch(error){
        return callback(error, null);
    }
    snippet += '};\n'
    snippet += 'this.variables = {\n';
    // TODO extract and add variables here
    // await collectionVariables.forEach(item =>{
    //     snippet += `${item.key}: '${item.value}',\n`
    // })
    // snippet += '}\n';
    snippet += `${sdkname}.prototype.setVariabes = function(variables) {\n`
    snippet += 'Object.keys(variables).forEach((key) => {\n';
    snippet += 'this.variables[key] = variables.key;\n';
    snippet += '});\n'
    snippet += '}\n'
    return callback(null, snippet);
}

/**
 * Gives a list of possible options for nodejs-request sdk generator
 */
function getOptions(){
    var result;
    getCodegenOptions('NodeJs', 'Request', (err, codegenOptions) => {
        if(err)
        {
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
}