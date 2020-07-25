const expect = require('chai').expect,
  sdk = require('postman-collection'),
  authRequests = require('../fixtures/auth_requests'),
  authorize = require('../../lib/auth/auth');

describe('Postman Request Authorization', function () {

  describe('API KEY authentication', function () {
    it('should add api header to request when in type is header', function () {
      let request = authRequests.API_KEY.KEY_VAL_HEADER;
      // TODO pass this request to authorize function
      request = authorize(request, request.auth);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.headers.has('key')).to.be.true;
      expect(request.getHeaders('key').key).to.be.equal('value');
    });

    it('should add api headers to request when api value is not given', function () {
      let request = authRequests.API_KEY.KEY_HEADER;
      request = authorize(request, request.auth);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.headers.has('key')).to.be.true;
      expect(request.getHeaders('key').key).to.be.equal('');
    });

    it('should not add api headers to request when api key and value is not given', function () {
      let request = authRequests.API_KEY.HEADER;
      request = authorize(request, request.auth);
      expect(request).to.be.of.instanceOf(sdk.Request);
    });

    it('should add api key query param when api key value and in type is query', function () {
      let request = authRequests.API_KEY.KEY_VAL_QUERY;
      request = authorize(request, request.auth);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.url.query.has('key')).to.be.true;
      expect(request.url.query.get('key')).to.be.equal('value');
    });

    it('should add api key query param when api key and in type is query', function () {
      let request = authRequests.API_KEY.KEY_QUERY;
      request = authorize(request, request.auth);
      expect(request).to.be.of.instanceOf(sdk.Request);
      expect(request.url.query.has('key')).to.be.true;
      expect(request.url.query.get('key')).to.be.equal('');
    });

    it('should add api key query param when api key value and in type is query', function () {
      let request = authRequests.API_KEY.QUERY;
      request = authorize(request, request.auth);
      expect(request).to.be.of.instanceOf(sdk.Request);
    });
  });

  describe('Bearer Token Authorization', function () {

    it('should add authorization header to request when bearer token it given', function () {
      let request = authRequests.BEARER_TOKEN.TOKEN;
      request = authorize(request, request.auth);
      expect(request).to.be.instanceOf(sdk.Request);
      expect(request.headers.has('Authorization')).to.be.true;
      expect(request.getHeaders('Authorization').Authorization).to.be.equal('Bearer testbearertoken');
    });
  });

  describe('Basic Authorization', function () {
    it('should add authorization header when basic authorization is used with username and password', function () {
      var request = authRequests.BASIC.USERNAME_PASSWORD;
      request = authorize(request, request.auth);
      expect(request).to.be.instanceOf(sdk.Request);
      expect(request.headers.has('Authorization')).to.be.true;
      expect(request.getHeaders('Authorization').Authorization).to.be.equal('Basic dGVzdDp0ZXN0');
    });

    it('should add authorization header when basic authorization is used with username and no password', function () {
      var request = authRequests.BASIC.USERNAME;
      request = authorize(request, request.auth);
      expect(request).to.be.instanceOf(sdk.Request);
      expect(request.headers.has('Authorization')).to.be.true;
      expect(request.getHeaders('Authorization').Authorization).to.be.equal('Basic dGVzdDo=');
    });

    it('should add authorization header when basic authorization is used with just password', function () {
      var request = authRequests.BASIC.PASSWORD;
      request = authorize(request, request.auth);
      expect(request).to.be.instanceOf(sdk.Request);
      expect(request.headers.has('Authorization')).to.be.true;
      expect(request.getHeaders('Authorization').Authorization).to.be.equal('Basic OnRlc3Q=');
    });

    it('should add authorization header when basic authorization is used with no username/password', function () {
      var request = authRequests.BASIC.NO_USERNAME_NO_PASS;
      request = authorize(request, request.auth);
      expect(request).to.be.instanceOf(sdk.Request);
      expect(request.headers.has('Authorization')).to.be.true;
      expect(request.getHeaders('Authorization').Authorization).to.be.equal('Basic Og==');
    });
  });
});
