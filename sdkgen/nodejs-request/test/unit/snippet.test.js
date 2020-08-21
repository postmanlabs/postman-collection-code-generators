const expect = require('chai').expect,
  sdk = require('postman-collection'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json'),
  },
  generate = require('../../index').generate,
  COLLECTION_INSTANCE = new sdk.Collection(collection.SDKGEN);

describe('Tests for generated sdk', () => {

  it('request variables should contain || notation instead of ? : notation', async () => {
    await generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, [
        {
          key: 'url',
          value: 'www.google.com'
        }
      ])
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('var url = variables.url || self.variables.url || \'\'');
    });
  });

  it('should contain complete function doc declaration for param', async () => {
    await generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, [
        {
          key: 'url',
          value: 'www.google.com'
        }
      ])
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('@param {object} variables - Variables used for this request');
      expect(snippet).to.include('@param {String} variables.url');
      expect(snippet).to.include('@param {Function} callback - Callback function to return response (err, res)');
    });
  });

  it('should have property name as ["property_name"]', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.include('this["POST_Raw_Text_Copy"]');
      expect(snippet).to.include('"POST_Form_Data"');
    });
  });

  it('should not contain any undefined description', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.be.a('string');
      expect(snippet).to.not.include('undefined');
    });
  });

  it('should not contain duplicate variable declaration in request', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
        // expect.fail(null, null, err);
      }
      let s = 'var url = variables.url || self.variables.url || \'\';';
      expect(snippet).to.be.a('string');
      expect(snippet).to.not.include(`${s}\n${s}`);
    });
  });
});
