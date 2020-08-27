const expect = require('chai').expect,
  sdk = require('postman-collection'),
  collection = {
    SDKGEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  generate = require('../../index').generate,
  COLLECTION_INSTANCE = new sdk.Collection(collection.SDKGEN);

describe('Tests for generated sdk formatting', () => {
  it('should generate beautified(with indentations and proper format) sdk.', async () => {
    await generate(COLLECTION_INSTANCE, {}, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      // fix this with chai snapshot
      for (let i = 1; i < 7; i++) {
        expect(snippet).to.include(' '.repeat(i * 2));
      }
    });
  });
});