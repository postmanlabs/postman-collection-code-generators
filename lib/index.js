const sdk = require('postman-collection'),
    fetch = require('node-fetch'),
    languageMap = require('./assets/languageMap.json'),
    codegen = require('postman-code-generators'),
    generator = require('../sdkgen/nodejs-request').generate, // TODO fix language mapping. this is temporary
    errors = require('./assets/error'),
    _ = require('lodash');

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
 * Checks and sanitizes optoins provided to sdkgenerator

 * @param {Object} sdkOptions - codegenoptions provided to generate method
 * @param {Object} codegenOptions - sdkoptions provided to generate method
 * @param {Function} callback - Callback function to return results (err, sdkgenoptions, codegenoptions);
 */
function checkOptions (sdkOptions, codegenOptions, callback) {
    // checks for sdkgenerator
    if (!_.isObject(sdkOptions)) {
        return callback(errors.INVALID_PARAMETER, null, null);
    }
    if (sdkOptions.language === null) {
        return callback(errors.INVALID_LANGUAGE, null, null);
    }
    if (sdkOptions.variant === null) {
        sdkOptions.variant = sdkOptions.language;
    }
    if (sdkOptions.outputType === 'File' && !sdkOptions.outputFilePath) {
        return callback(errors.FILE_PATH_NOT_PROVIDED, null, null);
    }
    // checks for codegenerator
    if (!_.isObject(codegenOptions) || codegenOptions === null) {
        return callback(errors.INVALID_PARAMETER, null, null);
    }
    return callback(null, sdkOptions, codegenOptions);
}

/**
 * Root Function which generates collection level code generator / Collection SDK

 * @param {String} source - Source of the collection
 * @param {Object} sdkOptions - Options for SDK generator
 * @param {String} sdkOptions.language - Specifies language for SDK generator
 * @param {String} sdkOptions.variant - Specifies language variant for SDK generator
 * @param {String} [sdkOptions.outputType] - Output method ie; string/file
 * @param {String} [sdkOptions.outputFilePath] - Output File path for sdk output
 * @param {String} [sdkOptions.readme] - Includes README along with the output.
 * @param {Object} [codeOptions] - Options for code generator
 * @param {Number} [codeOptions.indentType] - indentation based on Tab or spaces
 * @param {Number} [codeOptions.indentCount] - count/frequency of indentType
 * @param {Number} [codeOptions.requestTimeout] : time in milli-seconds after which request will bail out
 * @param {Boolean} [codeOptions.trimRequestBody] : whether to trim request body fields
 * @param {Boolean} [codeOptions.addCacheHeader] : whether to add cache-control header to postman SDK-request
 * @param {Boolean} [codeOptions.followRedirect] : whether to allow redirects of a request
 * @param {Function} callback - Callback function to return results
 */
async function generate (source, sdkOptions, codeOptions, callback) {
    let collection, collectionJson,
        snippet;
    checkOptions(sdkOptions, codeOptions, (error, sdkopts, codegenopts) => {
        if (error) {
            return callback(error, null);
        }
        sdkOptions = sdkopts;
        codeOptions = codegenopts;
    });
    if (sdk.Collection.isCollection(source)) {
        collection = source;
    }
    else if (_.isObject(source)) {
        collection = new sdk.Collection(source);
    }
    else if (source.match(/(https|http):\/\/[^\s$.?#].[^\s]*$/g)) {
        try {
            collectionJson = await fetch(source, {
                method: 'Get'
            });
            collectionJson = await collectionJson.json();
            collection = new sdk.Collection(collectionJson);
        }
        catch (error) {
            return callback(error, null);
        }
    }
    else if (source.match(/((.)[/\\](.))/g)) {
        collectionJson = await require(source);
        collection = new sdk.Collection(collectionJson);
    }
    else {
        return callback(errors.INVALID_COLLECTION_SOURCE, null);
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
    getCodegenOptions: codegen.getOptions,
};
