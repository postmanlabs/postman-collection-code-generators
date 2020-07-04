const expect = require('chai').expect,
  sdk = require('postman-collection'),
  authRequests = require('../fixtures/auth_requests'),
  authorize = require('../../lib/auth');

describe('Postman Request Authentication', function () {

  describe('API KEY authentication', function () {
    it('should add api header to request when in type is header', function () {
      var request = authRequests.API_KEY.KEY_VAL_HEADER;
      // TODO pass this request to authorize function
      request = authorize(request);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.headers.has('key')).to.be.true;
      expect(request.getHeaders('key').key).to.be.equal('value');
    });
  });
});
