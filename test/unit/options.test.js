const expect = require('chai').expect,
  sdkgen = require('../../'),
  collections = {
    SDKGEN: require('../fixtures/SDKGEN.postman_collection.json')
  };

describe('Option: Variables', function () {
  it('should not contain any variable config if variable is set to null/undefined or not provided', function () {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'Request'
    }, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('configVariables = {}');
    });
  });

  it('should include variable if variables are provided as object in key value format', function () {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'Request',
      variables: {
        variable1: 'value1',
        variable2: 'value2'
      }
    }, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('variable1: \'value1\'');
      expect(snippet).to.include('variable2: \'value2\'');
    });
  });
});
