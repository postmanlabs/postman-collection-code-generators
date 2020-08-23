const expect = require('chai').expect,
  sdk = require('postman-collection'),
  utils = require('../../lib/util'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  COLLECTION_INSTANCE = new sdk.Collection(collection.SDKGEN);

describe('Util methods tests:', () => {
  it('should not throw err when request does not have any variables',async () => {
    try {
      // items.members[4] -> item with no variables
      await utils.generateFunctionSnippet(COLLECTION_INSTANCE.items.members[4], {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
  });
});