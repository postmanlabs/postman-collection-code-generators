const expect = require('chai').expect,
  sdk = require('postman-collection'),
  utils = require('../../lib/util'),
  outputs = require('../fixtures/utilMethodOutputs.json'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  COLLECTION_INSTANCE = new sdk.Collection(collection.SDKGEN);

describe('Util methods tests:', () => {
  it('should sanitize strings properly', () => {
    // eslint-disable-next-line quotes
    let s = "test'string\\n\\";
    s = utils.sanitize(s);
    expect(s).to.be.a('string');
    expect(s).to.equals(outputs.SANITIZE);
  });

  it('should generate function snippet for a request', async () => {
    let snippet;
    try {
      snippet = await utils.generateFunctionSnippet(COLLECTION_INSTANCE.items.members[2], {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.be.a('string');
    expect(snippet).to.be.equals(outputs.GENERATE_FUNCTION_SNIPPEPT);
  });

  it('should generate item snippet for input item (parent --> collection instance)', async () => {
    let snippet;
    try {
      snippet = await utils.itemHandler(COLLECTION_INSTANCE.items.members[2], {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.be.a('string');
    expect(snippet).to.be.equals(outputs.ITEM_HANDLER.COLLECTION_AS_PARENT);
  });

  it('should generate item snippet for input item (parent --> itemgroup instance)', async () => {
    let snippet;
    try {
      snippet = await utils.itemHandler(COLLECTION_INSTANCE.items.members[0].items.members[0], {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.be.a('string');
    expect(snippet).to.include(outputs.ITEM_HANDLER.ITEMGROUP_AS_PARENT);
  });

  it('should generate snippet for get/set methods', () => {
    let snippet = utils.getVariableFunctions();
    expect(snippet).to.be.a('string');
    expect(snippet).to.include(outputs.GET_VARIABLE_FUNCTIONS);
  });
});
