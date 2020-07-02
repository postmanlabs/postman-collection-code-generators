const sdk = require('postman-collection');

/**
 * Method to merge more than one PostmanVariableList instances to get one unique list
 * Provide array in Decreasing order of their scope
 *
 * @param {Array} variableListArray - Array of PostmanVariableList to be combined together
 * @returns {PostmabVariableList} - PostmanVariableList instance containing variables of all variableLists provided
 */
function combineVariablesLists (variableListArray) {
  let variables = {},
    variableList = new sdk.VariableList();
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
  combineVariablesLists
};
