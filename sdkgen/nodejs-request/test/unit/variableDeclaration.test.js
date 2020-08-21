const expect = require('chai').expect,
  sdk = require('postman-collection'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  generate = require('../../index').generate,
  COLLECTION_INSTANCE = new sdk.Collection(collection.SDKGEN),
  variables = [
    {
      key: 'url',
      value: 'www.google.com'
    },
    {
      key: 'var1',
      value: '1'
    }
  ];

describe('Tests for Variable Declaration sdk', () => {
  it('should add variables which are provided through sdkgen', async () => {
    await generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, variables)
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('\'url\': \'www.google.com\'');
      expect(snippet).to.include('\'var1\': \'1\'');
    });
  });

  it('should add variable to doc if provided through options', async () => {
    await generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, variables)
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('@param {String} variables.var1');
    });
  });

  it('should add variable to request level variable if provided through options', async () => {
    await generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, variables)
    }, (err, snippet) => {
      if (err) {
        console.log(err);
        expect(err).to.be.null;
      }
      expect(snippet).to.include('var var1 = variables.var1 || self.variables.var1 || \'\';');
    });
  });

  it('should replace variable if its passed through options', async () => {
    await generate(COLLECTION_INSTANCE, {
      variableList: new sdk.VariableList(null, variables)
    }, (err, snippet) => {
      if (err) {
        console.log(err);
        expect(err).to.be.null;
      }
      expect(snippet).to.not.include('{{var1}}');
    });
  });

  it('should not add variable to doc if not provided through options', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.not.include('@param {String} variables.var1');
    });
  });

  it('should not add variable to request level variable if not provided through options', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.not.include('var var1 = variables.var1 ? variables.var1 : self.variables.var1;');
    });
  });

  it('should not replace a variable if its not passed through options', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        console.log(err);
        expect(err).to.be.null;
      }
      expect(snippet).to.include('{{var1}}');
    });
  });
});