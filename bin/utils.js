const fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  pwd = require('shelljs').pwd().stdout,
  fetch = require('node-fetch');

/**
 * Resolves absolute and relative path
 *
 * @param {string} location - path to be resolved
 */
module.exports.resolvePath = (location) => {
  return path.isAbsolute(location) ? location : path.resolve(path.join(pwd, location));
};

/**
 * Method to fetch collection json from a source
 *
 * @param {string} location - source location of collection
 * @param {function} callback - callback method to return err/collection json
 */
module.exports.fetchJSON = (location, callback) => {
  // if location is url
  if ((/^https?:\/\/.*/).test(location)) {
    fetch(location)
      .then(async (res) => {
        // checking if input source is a json
        try {
          res = await res.json();
        }
        catch (error) {
          return callback(new Error(`Source did not return a valid JSON.\n${error}`));
        }
        return callback(null, res);
      })
      .catch((err) => {
        console.log(err);
        return callback(new Error(`Unable to fetch JSON from ${location}\n${err}`));
      });
  }
  else {
    fs.readFile(location, (err, data) => {
      location = module.exports.resolvePath(location);
      if (err) {
        console.log(err);
        return callback(new Error(`Unable to Read file from ${location}`));
      }

      // checking if input source is json or not
      try {
        data = JSON.parse(data);
      }
      catch (error) {
        return callback(new Error(`Invalid JSON at: ${location}\n ${error}`));
      }

      return callback(null, data);
    });
  }
};

/**
 * Converts variables from cli args to key value pair objects
 *
 * @param {array} argVariables - list of variables input from commandline
 */
module.exports.argsToVariableList = (argVariables) => {
  return _.map(argVariables, (variable) => {
    let split = variable.split('=');
    // checking if input variable is in correct format
    if (split.length === 2) {
      return {
        key: split[0],
        value: split[1]
      };
    }
    console.log(`Variable ${variable} not provided in correct format. SKIPPING!`);
  });
};

/**
 * Combines array of variables to one variable object
 * Variable scope is resolved accoring postman variable scope resolution
 *  - global
 *  - collection
 *  - environment
 *  - data (passed from the user manually)
 * Scope of variables (min -> max)  ^
 */
module.exports.combineVariables = function () {
  let combinedVariables = {};
  // adding global variables to the object
  _.forEach(arguments, (VariableList) => {
    _.forEach(VariableList, (variable) => {
      combinedVariables[variable.key] = variable.value;
    });
  });
  return combinedVariables;
};

/**
 * Converts array of addtional options to key value pair of options
 *
 * @param {array} additional - Array of additional options provided in key=value fashion
 * @returns {object} - object of addtional options
 *
 */
module.exports.additionalOptionToJson = (additional) => {
  let options = {};
  _.forEach(additional, (option) => {
    let split = option.split('=');
    if (split.length !== 2) {
      console.log(`Invalid option format for option ${option}. SKIPPING`);
    }
    else {
      // converting input option value to its respective type
      split[1] = split[1] === 'true' ? true :
        split[1] === 'false' ? false :
          isNaN(split[1]) ? split[1] :
          // ~~ converts string number to number type
            ~~split[1];
      options[split[0]] = split[1];
    }
  });
  return options;
};

/**
 * Resolves input array of variables from its source location ie; filepath/url
 * TODO: replace current implementation(generate command) with this method
 */
module.exports.resolveVariables = function () {
  let combinedVariables = {};
  // adding global variables to the object
  _.forEach(arguments, (VariableList) => {
    _.forEach(VariableList, (variable) => {
      combinedVariables[variable.key] = variable.value;
    });
  });
  return combinedVariables;
};
