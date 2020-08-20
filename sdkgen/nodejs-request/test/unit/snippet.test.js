const expect = require('chai').expect,
  sdk = require('postman-collection'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  variables = {
    SIMPLE_AUTH: require('../../../../test/fixtures/Simple User Account.postman_collection.json')
  },
  generate = require('../../index').generate,
  COLLECTION_INSTANCE = new sdk.Collection(collection.SIMPLE_AUTH);

describe('Tests for generated sdk', () => {
  generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
    if (err) {
      expect(err).to.be.null;
    }
    // fix this with chai snapshot
    for (let i = 1; i < 3; i++) {
      it('should generate beautified(with indentations and proper format) sdk: indent depth ' + i, () => {
        expect(snippet).to.include(' '.repeat(i * 2));
      });
    }
  });
});
