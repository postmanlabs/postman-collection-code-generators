/**
 * Contains basic authentication methods:
 *  - Basic Auth
 *  - API key Auth
 *  - Bearer Token Auth
 */

const sdk = require('postman-collection'),
  digest = require('./digest'),
  hawk = require('./hawk'),
  {
    toBase64
  } = require('../helpers');


/**
 * Adds necessary headers / url params for api key authentication
 * In header -> key:value
 * In query param -> url?key=value
 *
 * @param {PostmanRequest} request - Postman Request instance
 */
function apiKey (request) {
  let config = {},
    auth = request.auth;
  // TODO add desc for query param and new headers
  // creating congif obj for easy access of elements
  auth.apikey.each((element) => {
    config[element.key] = element.value;
  });

  // if api key `key` is empty then dont add
  if (config.key === '') {
    return request;
  }

  // if apikey auth in type is headers
  if (config.in === 'header') {
    // adding apikey auth headers to request
    request.addHeader(new sdk.Header({
      key: config.key,
      value: config.value
    }));
  }
  // if apikey auth in type is query params
  else if (config.in === 'query') {
    // adding new query param to request for api key
    request.url.addQueryParams(new sdk.QueryParam({
      key: config.key,
      value: config.value
    }));
  }
  else {
    // TODO setup auth errors and return from here
    // temp return
    return 'error';
  }

  return request;
}

/**
 * Adds Authorization header for bearer authorization
 * Authorization: Bearer bearer_token
 *
 * @param {PostmanRequest} request - Postman Request instance
 */
function bearerToken (request) {
  let config = {},
    auth = request.auth;
  // TODO add desc for header
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
 * @param {PostmanRequest} request - Postman Request instance
 */
function basic (request) {
  let config = {},
    auth = request.auth;
  // TODO add desc for header
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
 * @param {PostmanRequest} request - Request instance which needs to be authorized
 */
function authorize (request) {
  if (!sdk.Request.isRequest(request)) {
    throw new Error('Invalid Request Instance');
  }
  var authorizedRequest = null;
  if (request.auth.type === 'apikey') {
    authorizedRequest = apiKey(request);
  }
  else if (request.auth.type === 'bearer') {
    authorizedRequest = bearerToken(request);
  }
  else if (request.auth.type === 'basic') {
    authorizedRequest = basic(request);
  }
  else if (request.auth.type === 'digest') {
    authorizedRequest = digest(request);
  }
  else if (request.auth.type === 'hawk') {
    authorizedRequest = hawk(request);
  }
  else {
    // TODO return legit err
    console.log('return err');
  }
  return authorizedRequest;
}

module.exports = authorize;
