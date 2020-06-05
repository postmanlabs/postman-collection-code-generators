const sdk = reqire('postman-collection'),
    _ = require('lodash'),
    fetch = require('node-fetch'),
    { fetchJson, parseCollection } = require('./util'),
    codegens = require('./assets/codegens'),
    languageMap = require('./assets/languageMap.json');

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
            availableOptions: ['file', 'string'],
            default: 'string',
            type: 'String',
            Description: 'Specifies Type of Output to the generaed SDK'
        },
        language: {
            name: 'SDK Language',
            id: 'language',
            availableOptions: Object.keys(getLanguageList()),
            type: 'String',
            Description: 'Specifies Language for SDK generation'
        },
        variant: {
            name: 'SDK language variant',
            id: 'variant',
            availableOptions: getLanguageList(),
            type: 'String',
            Description: 'Specifies Language variant for SDK generation'
        }
    };
}

/**
 * [Description]
 *
 * @param {String} language - Language for code generator
 * @param {String} [variant] - Language variant for codegenerator
 */
function getCodegenOptions (language, variant) {
    var codegenName = variant ? language + '-' + variant : language;
    if (codgens[codegenName]) {
        return codegens[codegenName].getOptions();
    }
    return new Error('invalid codegen name');
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {String} source - Source of the collection
 * @param {Object} sdkOptions - Options for SDK generator
 * @param {String} sdkOptions.language - Specifies language for SDK generator
 * @param {String} sdkOptions.variant - Specifies language variant for SDK generator
 * @param {String} sdkOptions.outputType - Output method ie; string/file
 * @param {Object} codeOptions - Options for code generator
 * @param {Number} [codeOptions.indentType] - indentation based on Tab or spaces
 * @param {Number} [codeOptions.indentCount] - count/frequency of indentType
 * @param {Number} [codeOptions.requestTimeout] : time in milli-seconds after which request will bail out
 * @param {Boolean} [codeOptions.trimRequestBody] : whether to trim request body fields
 * @param {Boolean} [codeOptions.addCacheHeader] : whether to add cache-control header to postman SDK-request
 * @param {Boolean} [codeOptions.followRedirect] : whether to allow redirects of a request
 * @param {Function} callback - Callback function to return results
 */
function generate (source, sdkOptions, codeOptions, callback) {
    let collection,
        snippet;
    if (typeof (source) === 'object') {

        if (sdk.collection.isCollection(source)) {
            collection = source;
        }
        else {
            fetchJson(source, (err, pmCollection) => {
                if (err) {
                    return err;
                }
                collection = pmCollection;
            });
        }
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

    parseCollection(collection, (err, pmCollection) => {
        if (err) {
            callback(err, null);
            return;
        }
        collection = pmCollection;
    });
    // options order and values
    // ? collection | variables | options | callback
    snippet = generator(collection, null, null, function (err, sdkSnippet) {
        if (err) {
            callback(err, null);
            return;
        }
        snippet = sdkSnippet;
    });

    if (sdkOptions.sdkOptions === 'file') {
        return callback(null, 'File exported at location: ....');
    }
    return callback(null, snippet);
}

module.exports = {
    generate,
    getLanguageList,
    getSDKOptions,
    getCodegenOptions
};
