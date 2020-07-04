const expect = require('chai').expect,
  sdk = require('postman-collection'),
  authRequests = require('../fixtures/auth_requests'),
  authorize = require('../../lib/auth');

describe('Postman Request Authorization', function () {

  describe('API KEY authentication', function () {
    it('should add api header to request when in type is header', function () {
      var request = authRequests.API_KEY.KEY_VAL_HEADER;
      // TODO pass this request to authorize function
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.headers.has('key')).to.be.true;
      expect(request.getHeaders('key').key).to.be.equal('value');
    });

    it('should add api headers to request when api value is not given', function () {
      var request = authRequests.API_KEY.KEY_HEADER;
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.headers.has('key')).to.be.true;
      expect(request.getHeaders('key').key).to.be.equal('');
    });

    it('should not add api headers to request when api key and value is not given', function () {
      var request = authRequests.API_KEY.HEADER;
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
    });

    it('should add api key query param when api key value and in type is query', function () {
      var request = authRequests.API_KEY.KEY_VAL_QUERY;
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.url.query.has('key')).to.be.true;
      expect(request.url.query.get('key')).to.be.equal('value');
    });

    it('should add api key query param when api key and in type is query', function () {
      var request = authRequests.API_KEY.KEY_QUERY;
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.url.query.has('key')).to.be.true;
      expect(request.url.query.get('key')).to.be.equal('');
    });

    it('should add api key query param when api key value and in type is query', function () {
      var request = authRequests.API_KEY.QUERY;
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
    });
  });
});
