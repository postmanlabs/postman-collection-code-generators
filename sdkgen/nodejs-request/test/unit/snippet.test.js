const { generateFunctionSnippet } = require('../../lib/util');

const expect = require('chai').expect,
  sdkgen = require('../../'),
  sdk = require('postman-collection'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  generate = require('../../index').generate;

describe('Tests for generated sdk', () => {
  it('should generate snippet when collection is provided', function () {
    generate(new sdk.Collection(collection.SDKGEN), {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).not.to.be.null;
      expect(snippet).to.include('var request = require(\'request\');');
      expect(snippet).to.include('function SDK(environment = {}) {');
      expect(snippet).to.include('module.exports = SDK;');
    });
  });

  it('snippet should inclue get variable method', function () {
    generate(new sdk.Collection(collection.SDKGEN), {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).not.to.be.null;
      expect(snippet).to.include('SDK.prototype.getVariables = function (var) {');
    });
  });

  it('snippet should include set Variable method', function () {
    generate(new sdk.Collection(collection.SDKGEN), {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).not.to.be.null;
      expect(snippet).to.include('SDK.prototype.setVariables = function (vars) {');
    });
  });
});
