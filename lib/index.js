const sdk = require('postman-collection'),
    _ = require('lodash'),
    fetch = require('node-fetch'),
    codegens = require('./assets/codegens'),
    languageMap = require('./assets/languageMap.json'),
    codegen = require('postman-code-generators'),
    generator = require('../sdkgen/nodejs-request').generate; //TODO fix language mapping. this is temporary

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
            description: 'Specifies Type of Output for the generaed SDK'
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
        }
    };
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {String} source - Source of the collection
 * @param {Object} sdkOptions - Options for SDK generator
 * @param {String} sdkOptions.language - Specifies language for SDK generator
 * @param {String} sdkOptions.variant - Specifies language variant for SDK generator
 * @param {String} [sdkOptions.outputType] - Output method ie; string/file
 * @param {String} [sdkOptions.includeGitignore] - Includes Gitignore along with the output.
 * @param {String} [sdkOptions.readme] - Includes README along with the output.
 * @param {Object} codeOptions - Options for code generator
 * @param {Number} [codeOptions.indentType] - indentation based on Tab or spaces
 * @param {Number} [codeOptions.indentCount] - count/frequency of indentType
 * @param {Number} [codeOptions.requestTimeout] : time in milli-seconds after which request will bail out
 * @param {Boolean} [codeOptions.trimRequestBody] : whether to trim request body fields
 * @param {Boolean} [codeOptions.addCacheHeader] : whether to add cache-control header to postman SDK-request
 * @param {Boolean} [codeOptions.followRedirect] : whether to allow redirects of a request
 * @param {Function} callback - Callback function to return results
 * TODO update url regex
 * TODO add source check for file/path
 */
async function generate (source, sdkOptions, codeOptions, callback) {
    let collection,
        snippet;
    if (sdk.Collection.isCollection(source)) {
            collection = source;
    }
    else if(typeof source === 'object'){
        collection = new sdk.Collection(source);
    }
    else if (source.match(/(https?|chrome):\/\/[^\s$.?#].[^\s]*$/g)) {
        fetch(source, {
            method: 'Get'
        })
            .then((res) => { return JSON.parse(res); })
            .then((collectionJSON) => {
                collection = collectionJSON;
            });
    }
    else {
        return callback(new Error('invalid collection source'), null);
    }

    await generator(collection, codeOptions, function (err, sdkSnippet) {
        if (err) {
            callback(err, null);
            return;
        }
        snippet = sdkSnippet;
    });

    if (sdkOptions.outputType === 'File') {
        return callback(null, 'File exported at location: ....');
    }
    return callback(null, snippet);
}

module.exports = {
    generate,
    getLanguageList,
    getSDKOptions,
    getCodegenOptions: codegen.getOptions
};
