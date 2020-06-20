const expect = require('chai').expect,
  replaceVariables = require('../../lib/util').replaceVariables,
  variableDecarations = require('../fixtures/variable_declarations');

describe('replaceVariable Method', () => {
  variableDecarations.forEach((element) => {
    it('should properly replace ' + element.string + ' as ' + element.replaceValue, () => {
      var result = replaceVariables(element.string);
      expect(result).to.include(element.replaceValue);
    });
  });
});