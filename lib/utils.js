const sdk = require('postman-collection');

/**
 * Method to merge more than one PostmanVariableList instances to get one unique list
 * Provide array in Decreasing order of their scope
 *
 * @param {Object} variableLists - Array of PostmanVariableList to be combined together
 * @returns {PostmabVariableList} - PostmanVariableList instance containing variables of all variableLists provided
 */
function resolveVariables (variableLists) {
  let variables = {},
    variableListArray = [],
    variableList = new sdk.VariableList();

  if (variableLists.global) {
    variableListArray.push(variableLists.global);
  }
  if (variableLists.collection) {
    variableListArray.push(variableLists.collection);
  }
  if (variableLists.environment) {
    variableListArray.push(variableLists.environment);
  }

  variableListArray.forEach((PostmanVariableList) => {
    PostmanVariableList.each((PostmanVariable) => {
      variables[PostmanVariable.key] = PostmanVariable.value;
    });
  });

  Object.keys(variables).forEach((element) => {
    variableList.append(new sdk.Variable({
      key: element,
      value: variables[element]
    }));
  });
  return variableList;
}

module.exports = {
  resolveVariables
};
