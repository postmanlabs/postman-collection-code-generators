const { convert } = require('postman-code-generators'),
  sdk = require('postman-collection'),
  beautify = require('js-beautify'),
  getAuthConfig = require('../../../lib/auth/utils').getAuthOptions,
  _ = require('lodash');

/**
 * sanitizes input string by handling escape characters eg: converts '''' to '\'\''
 *
 * @param {String} inputString
 * @returns {String}
 */
function sanitize (inputString) {
  if (typeof inputString !== 'string') {
    return '';
  }
  return inputString.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\n/g, '\\n');
}

function getCamelCaseName (input) {
  var result = input.split(' ').join('-').toLowerCase();
  result = result.replace(/-([a-z])/g, (g) => { return g[1].toUpperCase(); });

  return result;
}

/**
 * Replaces postman variables( {{variable}} ) in the generated snippet as
 * `' + variable_name + '`
 *
 * @param {String} requestSnippet - Request snipept generated by postman-code-generator
 * @param {Array} variableList - Array of variables that needs to be replaced
 * @returns {String} - Request snippet string with replaced collection variables
 */
function replaceVariables (requestSnippet, variableList) {
  var variableDeclarations = requestSnippet.match(/{{[^{\s\n}]*}}/g);
  if (variableDeclarations !== null) {
    variableDeclarations.forEach((element) => {
      let variableName = element.substring(2, element.length - 2);
      // checking if variable is provided by user in options and replacing only those variables
      if (variableList.includes(variableName)) {
        // replacing {{variable_name}} with ' + variable_name + '
        requestSnippet = requestSnippet.replace(element, '\' + ' + variableName + ' + \'');
      }
    });
  }
  return requestSnippet;
}

/**
 * [Description]
 *
 * @param returnType - Type of return for function (callback/Promise)
 * @returns {Array} - array of snippets for return method
 */
function getReturnMethodSnippets (returnType) {
  let snippets = [];
  if (returnType === 'Promise') {
    snippets.push('if (error) {');
    snippets.push('return reject(error);');
    snippets.push('}');
    snippets.push('return resolve(response);');
  }
  if (returnType === 'Callback') {
    snippets.push('return callback(error, response);');
  }
  return snippets;
}

/**
 * Adds required auth generation snippets
 *  - hawk
 *
 * @param {sdk.Item} item - Parent item of request
 * @param {string} requestSnippet - Request snippet generate by postman-code-generators
 * @returns {object} - {request snippet with replaced auth headers, auth declaration snippet}
 */
function getAuthSnippet (item, requestSnippet) {
  let request = item.request,
    config,
    authSnippet = '',
    HAWK_AUTH_HEADER = `_${item.id}_HAWK_${item.id}_`;

  if (!request.auth && !item.getAuth()) {
    return {authSnippet, requestSnippet};
  }

  config = getAuthConfig(request.auth || item.getAuth());

  if (requestSnippet.match(HAWK_AUTH_HEADER)) {
    requestSnippet = requestSnippet.replace(HAWK_AUTH_HEADER, '\' + hawkAuth + \'');
    authSnippet = `let hawkAuth = hawk.client.header(
      '${request.url}',
      '${request.method}',
      {
        credentials: {
          id: '${sanitize(config.authId)}',
          key: '${sanitize(config.authKey)}',
          algorithm: '${sanitize(config.algorithm)}',
        },
        ext: '${sanitize(config.extraData)}',
        timestamp: '${sanitize(config.timestamp)}',
        nonce: '${sanitize(config.nonce)}',
        payload: '${request.body ? sanitize(request.body.toString()) : ''}',
        app: '${sanitize(config.app)}',
        dlg: '${sanitize(config.delegation)}'
      }
    ).header;\n`;
  }
  return {authSnippet, requestSnippet};
}


/**
 * Generates snippet for a function declaration

 * @param {sdk.Item} collectionItem - PostmanItem Instance
 * @param {Object} options - postman-code-gen options (for specific language)
 * @returns {String} - returns a snippet of function declaration of of a request
 */
function generateFunctionSnippet (collectionItem, options) {
  return new Promise((resolve, reject) => {
    let snippet = '',
      variableDeclarations,
      authSnippets,
      request = collectionItem.request,
      variables = options.variableList ? _.map(options.variableList.members, 'key') : [],
      collectionItemName = getCamelCaseName(collectionItem.name);

    convert('NodeJs', 'Request', request, {
      SDKGEN_enabled: true,
      ...options
    }, function (error, requestSnippet) {
      if (error) {
        return reject(error);
      }


      // extract varaibles used from snipept
      variableDeclarations = requestSnippet.match(/{{[^{\s\n}]*}}/g);
      variableDeclarations = new Set(variableDeclarations);

      // JSDocs declaration
      snippet += `/**\n${request.description ? request.description.toString() + '\n' : ''}`;

      if (variableDeclarations) {
        snippet += variables.length ? '@param {object} variables - Variables used for this request\n' : '';
        variableDeclarations.forEach((element) => {
          let varName = element.substring(2, element.length - 2);
          // checking if variable name is provided as variable in options
          if (variables.includes(varName)) {
            snippet += `@param {String} variables.${varName}\n`;
          }
        });
      }
      snippet += options.returnMethod === 'Callback' ?
        '@param {Function} callback - Callback function to return response (err, res)\n' :
        '';

      snippet += '*/\n';

      // class property name declaration
      if (sdk.Collection.isCollection(collectionItem.__parent.__parent)) {
        snippet += `this["${collectionItemName}"] = `;
      }
      else {
        snippet += `"${collectionItemName}": `;
      }

      if (options.returnMethod === 'Callback') {
      // function signature declaration
        snippet += variables.length ? '(variables, callback) => {\n' : '(callback) => {\n';
        if (variables.length) {
          snippet += 'if (typeof variables === \'function\') {\n';
          snippet += 'callback = variables;\n';
          snippet += 'variables = {};\n';
          snippet += '}\n';
        }
      }

      if (options.returnMethod === 'Promise') {
        snippet += options.ES6_enabled ? '(variables = {}) => {\n' : 'function(variables = {}){\n';
        snippet += 'return new Promise((resolve, reject) => {\n';
      }

      // Request level variable declaration
      if (variableDeclarations) {
        variableDeclarations.forEach((element) => {
          let varName = element.substring(2, element.length - 2);
          // declaring request level variables for only those which are provided by the user in options
          if (variables.includes(varName)) {
            snippet += `let ${varName} = variables.${varName} || self.variables.${varName} || '';\n`;
          }
        });
      }

      // replacing return method
      requestSnippet = requestSnippet.replace(
        'callback(error, response);\n',
        getReturnMethodSnippets(options.returnMethod).join('\n')
      );

      // get auth related snippets
      authSnippets = getAuthSnippet(collectionItem, requestSnippet);

      // add auth variables
      snippet += replaceVariables(authSnippets.authSnippet, variables);

      // replace auth variables
      requestSnippet = authSnippets.requestSnippet;

      if (options.returnMethod === 'Promise') {
        snippet += '});';
      }

      snippet += replaceVariables(requestSnippet, variables);
      snippet += '}';
      return resolve(snippet);
    });
  });
}

/**
 * A handler function used to generate snippet for a pm.Item
 *
 * @param {sdk.Item} collectionItem - Postman Collection Item instance
 * @param {object} options - postman-code-generator options
 * @returns {string} - string contaning snippet for input item
 */
async function itemHandler (collectionItem, options) {
  let snippet = '';
  snippet += await generateFunctionSnippet(collectionItem, options);
  snippet += sdk.Collection.isCollection(collectionItem.__parent.__parent) ? ';\n\n' : '\n';
  return snippet;
}

/**
 * Handler function userd to generate snippet for a pm.ItemGroup
 *
 * @param {sdk.ItemGroup} collectionItem - Postman Collection Item Member
 * @param {array } memberResults - Array of result after passing through processCollection method for this ItemGroup
 * @returns {string} - snippet for input ItemGroup
 */
function itemGroupHandler (collectionItem, memberResults) {
  let snippet = '',
    collectionItemName = getCamelCaseName(collectionItem.name);

  snippet += `/**\n${collectionItem.description ? collectionItem.description.toString() + '\n' : ''}*/\n`;
  if (sdk.Collection.isCollection(collectionItem.__parent.__parent)) {
    snippet += `this.${collectionItemName} =  {\n`;
    snippet += memberResults.join(',');
    snippet += '};\n\n';
  }
  else {
    snippet += `"${collectionItemName}":  {\n`;
    snippet += memberResults.join(',');
    snippet += '}\n';
  }
  return snippet;
}

/**
 * Returns function snippet for getVariable method
 *
 * @returns {string} set variable method snippet
 */
function getVariableFunction () {
  let getVariable = '';

  getVariable += '/**\n';
  getVariable += 'Method to retrieve current variable.\n\n';
  getVariable += '@param {string} [variable] - Variable name\n';
  getVariable += '@returns {Object} object containing variables\n';
  getVariable += '*/\n';
  getVariable += 'SDK.prototype.getVariables = function (variable) {\n';
  getVariable += 'return variable ? this.variables[variable] : this.variables;\n';
  getVariable += '};\n\n';

  return getVariable;
}

/**
 * Returns function snippet for get variable method
 *
 * @returns {string} - set variable method snippet
 */
function setVariableFunction () {
  let setVariable = '';

  setVariable += '/**\n';
  setVariable += 'Function to set variables for entire SDK. ';
  setVariable += 'These variables will override existing/default values.\n\n';
  setVariable += '@param {Object} Object containing env variables\n';
  setVariable += '*/\n';
  setVariable += 'SDK.prototype.setVariables = function (vars) {\n';
  setVariable += 'let variables = _.cloneDeep(this.variables || configVariables);\n';
  setVariable += 'Object.keys(vars).forEach(function (key) {\n';
  setVariable += 'if (configVariables[key]) {\n';
  setVariable += 'variables[key] = vars[key];\n';
  setVariable += '}\n';
  setVariable += 'else {\n';
  // eslint-disable-next-line no-template-curly-in-string
  setVariable += 'console.log(`Variable name "${key}" is not being used in the SDK hence not declared.`)\n';
  setVariable += '}\n';
  setVariable += '});\n';
  setVariable += 'this.variables = variables;\n';
  setVariable += 'return this.variables;\n';
  setVariable += '};\n\n';

  return setVariable;
}

/**
 * Generates snippet for class docs
 *
 * @param {sdk.Collection} collection - Collection Instance
 * @param {sdk.VariableList} [variables] - Variable list to be added to the sdk
 */
function getClassDoc (collection, variables) {
  let snippet = '';

  snippet += '/**\n';
  snippet += collection.description ? collection.description.toString() + '\n' : '';
  snippet += '@param {object} config - Variables to used in SDK. \n';

  if (variables) {
    variables.each((variable) => {
      snippet += `@param {String} config.${variable.key}\n`;
    });
  }

  snippet += '*/\n';

  return snippet;
}


/**
 * Returns beautified js SDK snippet
 *
 * @param {string} snippet - SDK snippet
 * @param {number} indentSize - size of indentation (space)
 */
function format (snippet, indentSize) {
  return beautify(snippet, { indent_size: indentSize, space_in_empty_paren: true });
}

/**
 * Returns snippet for library imports for generating sdk
 *
 * @param {sdk.Collection} collection - Postman collection instance
 */
function getRequireList (collection) {
  let requireList = [
    'const request = require(\'request\');',
    'const _ = require(\'lodash\');'
  ];

  collection.forEachItem((item) => {
    if (item.request.auth ? (item.request.auth.type === 'hawk') : false) {
      if (!requireList.includes('const hawk = require(\'@hapi/hawk\');')) {
        requireList.push('const hawk = require(\'@hapi/hawk\');');
      }
    }
  });

  return requireList;
}

module.exports = {
  sanitize,
  getAuthSnippet,
  generateFunctionSnippet,
  itemHandler,
  itemGroupHandler,
  getVariableFunction,
  setVariableFunction,
  getClassDoc,
  getRequireList,
  format
};

