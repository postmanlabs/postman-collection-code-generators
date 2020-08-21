const { convert } = require('postman-code-generators'),
  sdk = require('postman-collection');

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

/**
 * Replaces postman variables( {{variable}} ) in the generated snippet as
 * `' + variable_name + '`
 *
 * @param {String} requestSnippet - Request snipept generated by postman-code-generator
 * @returns {String} - Request snippet string with replaced collection variables
 */
function replaceVariables (requestSnippet) {
  var variableDeclarations = requestSnippet.match(/{{[^{\s\n}]*}}/g);
  if (variableDeclarations !== null) {
    variableDeclarations.forEach((element) => {
      // replacing {{variable_name}} with ' + variable_name + '
      requestSnippet = requestSnippet.replace(element, '\' + ' + element.substring(2, element.length - 2) + ' + \'');
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
 * Generates snippet for a function declaration

 * @param {sdk.Item} collectionItem - PostmanItem Instance
 * @param {Object} options - postman-code-gen options (for specific language)
 * @returns {String} - returns a snippet of function declaration of of a request
 */
function generateFunctionSnippet (collectionItem, options) {
  return new Promise((resolve, reject) => {
    let snippet = '',
      variableDeclarations,
      request = collectionItem.request,
      collectionItemName = collectionItem.name.split(' ').join('_');

    convert('NodeJs', 'Request', request, {
      SDKGEN_enabled: true,
      ...options
    }, function (error, requestSnippet) {
      if (error) {
        return reject(error);
      }

      variableDeclarations = requestSnippet.match(/{{[^{\s\n}]*}}/g);
      variableDeclarations = new Set(variableDeclarations);

      // JSDocs declaration
      snippet += `/**\n${request.description ? request.description + '\n' : ''}`;
      if (variableDeclarations) {
        snippet += '@param {object} variables - Variables used for this request\n';
        variableDeclarations.forEach((element) => {
          let varName = element.substring(2, element.length - 2);
          snippet += `@param {String} variables.${varName}\n`;
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
        snippet += options.ES6_enabled ? '(variables, callback) => {\n' : 'function(variables, callback){\n';
        snippet += 'if (typeof variables === \'function\') {\n';
        snippet += 'callback = variables;\n';
        snippet += 'variables = {};\n';
        snippet += '}\n';
      }

      if (options.returnMethod === 'Promise') {
        snippet += options.ES6_enabled ? '(variables = {}) => {\n' : 'function(variables = {}){\n';
        snippet += 'return new Promise((resolve, reject) => {\n';
      }

      // Request level variable declaration
      if (variableDeclarations) {
        variableDeclarations.forEach((element) => {
          let varName = element.substring(2, element.length - 2);
          snippet += options.ES6_enabled ? 'let ' : 'var ';
          snippet += `${varName} = variables.${varName} || self.variables.${varName} || '';\n`;
        });
      }

      // replacing return method

      requestSnippet = requestSnippet.replace(
        'callback(error, response);\n',
        getReturnMethodSnippets(options.returnMethod).join('\n')
      );

      // replaceVariable replaces all the postman variables and returns the resulting snippet
      snippet += replaceVariables(requestSnippet);

      if (options.returnMethod === 'Promise') {
        snippet += '});';
      }

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
    collectionItemName = collectionItem.name.split(' ').join('_');

  snippet += `/**\n${collectionItem.description ? collectionItem.description + '\n' : ''}*/\n`;
  if (sdk.Collection.isCollection(collectionItem.__parent.__parent)) {
    snippet += `this["${collectionItemName}"] =  {\n`;
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
  setVariable += 'let variables = JSON.parse(JSON.stringify(this.variables || configVariables));\n';
  setVariable += 'Object.keys(vars).forEach(function (key) {\n';
  setVariable += 'variables[key] = vars[key];\n';
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
  snippet += collection.description ? collection.description + '\n' : '';
  snippet += '@param {object} config - Variables to used in SDK. \n';

  if (variables) {
    variables.each((variable) => {
      snippet += `@param {String} config.${variable.key}\n`;
    });
  }

  snippet += '*/\n';

  return snippet;
}

module.exports = {
  sanitize,
  generateFunctionSnippet,
  itemHandler,
  itemGroupHandler,
  getVariableFunction,
  setVariableFunction,
  getClassDoc
};
