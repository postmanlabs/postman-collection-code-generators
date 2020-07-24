/**
 * Contains basic authentication methods:
 *  - Basic Auth
 *  - API key Auth
 *  - Bearer Token Auth
 */

const sdk = require('postman-collection'),
  errors = require('../assets/error'),
  digest = require('./digest'),
  {
    toBase64
  } = require('../helpers');


/**
 * Adds necessary headers / url params for api key authentication
 * In header -> key:value
 * In query param -> url?key=value
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 */
function apiKey (request, auth) {
  let config = {};
  // creating congif obj for easy access of elements
  auth.apikey.each((element) => {
    config[element.key] = element.value;
  });

  // if api key `key` is empty then dont add
  if (config.key === '') {
    return request;
  }

  // if apikey auth in type is headers
  if (config.in === 'query') {
    // adding new query param to request for api key
    request.url.addQueryParams(new sdk.QueryParam({
      key: config.key,
      value: config.value
    }));
  }
  // if apikey auth in type is query params
  else {
    // adding apikey auth headers to request
    request.addHeader(new sdk.Header({
      key: config.key,
      value: config.value
    }));
  }

  return request;
}

/**
 * Adds Authorization header for bearer authorization
 * Authorization: Bearer bearer_token
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 */
function bearerToken (request, auth) {
  let config = {};
  // creating congif obj for easy access of elements
  auth.bearer.each((element) => {
    config[element.key] = element.value;
  });

  // if bearer token is empty then dont add
  if (config.token === '') {
    return request;
  }

  // Adds Authorizaition: Bearer token_value to request
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: 'Bearer ' + config.token
  }));

  return request;
}

/**
 * Adds Authorization header for basic authorization
 * Authorization: basic buagwdnasdw==
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 */
function basic (request, auth) {
  let config = {};
  // creating congif obj for easy access of elements
  auth.basic.each((element) => {
    config[element.key] = element.value;
  });

  /**
   * Authorization header:
   *  Basic base64(username:password)
   */
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: 'Basic ' + toBase64(`${config.username}:${config.password}`)
  }));

  return request;
}

/**
 * Authorizes a postman-request instance
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 */
function authorize (request, auth) {
  if (auth.type === 'apikey') {
    return apiKey(request, auth);
  }
  else if (auth.type === 'bearer') {
    return bearerToken(request, auth);
  }
  else if (auth.type === 'basic') {
    return basic(request, auth);
  }
  else if (auth.type === 'digest') {
    return digest(request, auth);
  }

  throw errors.INVALID_AUTH_TYPE;
}

module.exports = authorize;
