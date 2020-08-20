const expect = require('chai').expect,
  sdk = require('postman-collection'),
  utils = require('../../lib/util'),
  authorizeCollection = require('../.././../../lib/utils').authorizeCollection,
  collection = {
    SDK_GEN: require('../../../../test/fixtures/SDKGEN.postman_collection.json')
  },
  COLLECTION_INSATNCE = new sdk.Collection(collection.SDK_GEN),
  HAWK_ITEM = COLLECTION_INSATNCE.items.members[3],
  NON_HAWK_ITEM = COLLECTION_INSATNCE.items.members[2];

authorizeCollection(COLLECTION_INSATNCE);

describe('Hawk snippet test:', () => {
  it('should replace hawk header with hawkAuth variable', async () => {
    let snippet;
    try {
      snippet = await utils.generateFunctionSnippet(HAWK_ITEM, {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.include('hawkAuth');
  });

  it('should replace hawk header with hawkAuth variable', async () => {
    let snippet;
    try {
      snippet = await utils.generateFunctionSnippet(HAWK_ITEM, {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.include(`hawk.client.header(
      '' + url + '/get?foo1=' + var1 + '' + var4 + '&foo2=' + var2 + '' + var5 + '',
      'GET',
      {
        credentials: {
          id: 'testid',
          key: 'testkeyssss',
          algorithm: 'sha256',
        },
        ext: 'aaaaa',
        timestamp: '',
        nonce: '',
        payload: '',
        app: 'apppp',
        dlg: 'dlgggg'
      }
    ).header;`);
  });

  it('should not have hawkAuth if hawk is not added to item', async () => {
    let snippet;
    try {
      snippet = await utils.generateFunctionSnippet(NON_HAWK_ITEM, {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.not.include('hawkAuth');
  });

  it('should not have hawk function call if hawk is not added to item', async () => {
    let snippet;
    try {
      snippet = await utils.generateFunctionSnippet(NON_HAWK_ITEM, {});
    }
    catch (err) {
      expect(err).to.be.null;
    }
    expect(snippet).to.not.include(`{
        credentials: {
          id: 'testid',
          key: 'testkeyssss',
          algorithm: 'sha256',
        },
        ext: 'aaaaa',
        timestamp: '',
        nonce: '',
        payload: '',
        app: 'apppp',
        dlg: 'dlgggg'
      }`);
  });
});
