const expect = require('chai').expect,
  sdk = require('postman-collection'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  variables = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN_ENVIRONMENT.json')
  },
  generate = require('../../index').generate,
  COLLECTION_INSTANCE = new sdk.Collection(collection.SDKGEN);

describe('Tests for generated sdk', () => {

  it('should generate sdk snippet', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
    });
  });

  it('should include nodejs-request library import', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('var request = require(\'request\')');
    });
  });


  it('should add variable if provided', () => {
    generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, variables.SDKGEN.values)
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('\'url\': \'www.google.com\'');
      expect(snippet).to.include('\'var1\': \'valenv1\'');
      expect(snippet).to.include('\'var2\': \'valenv2\'');
    });
  });

  it('should have default constructor for generated module', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('function SDK(config = {})');
    });
  });

  it('should have get/set Variable methods', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('SDK.prototype.setVariables = function (vars) {');
      expect(snippet).to.include('SDK.prototype.getVariables = function (variable) {');
    });
  });

  it('should set initial variables values', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('this.variables = this.setVariables(config)')
    });
  });

  it('should have self variable declaration', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('self = this');
    });
  });

  it('should have export module snipept', () => {
    generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('module.exports = SDK');
    });
  });
});
