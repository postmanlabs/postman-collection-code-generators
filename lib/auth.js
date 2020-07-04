const sdk = require('postman-collection');
const authRequest = require('../test/fixtures/auth_requests')

/**
 * Adds necessary headers / url params for api key authentication
 *
 * @param request - Postman Request instance
 */
function api_key (request = authRequest.API_KEY.KEY_VAL_HEADER) {
  let config = {},
    auth = request.auth;
  // TODO add desc for query param and new headers
  // creating congif obj for easy access of elements
  auth.apikey.each((element) => {
    config[element.key] = element.value;
  });

  // if apikey auth in type is headers
  if (config.in === 'header') {
    // adding apikey auth headers to request
    request.addHeader(new sdk.Header({
      key: config.key,
      value: config.value
    }));
  }

  // if apikey auth in type is query params
  if (config.in === 'query') {
    // adding new query param to request for api key
    request.url.addQueryParams(new sdk.QueryParam({
      key: config.key,
      value: config.value
    }));
  }
  return request;
}

/**
 * Authorizes a postman-request instance
 *
 * @param {PostmanRequest} request - Request instance which needs to be authorized
 */
function authorize (request) {
  var authorizedRequest = null;
  if (request.auth.type === 'apikey') {
    authorizedRequest = api_key(request);
  }
  return authorizedRequest;
}

module.exports = authorize;
