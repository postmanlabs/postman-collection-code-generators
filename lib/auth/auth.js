/**
 * Contains basic authentication methods:
 *  - Basic Auth
 *  - API key Auth
 *  - Bearer Token Auth
 * Authorizer method which calls the above methods as per the input auth
 */

const sdk = require('postman-collection'),
  errors = require('../assets/error'),
<<<<<<< HEAD
  getConfig = require('./utils').getAuthOptions,
=======
>>>>>>> e0ead4d... Adds hawk authorizer to auth
  hawk = require('./hawk'),
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
 */
function apiKey (request, auth) {
  // get auth options in key value pair format
  let config = getConfig(auth);

  // return if apikey header or query param is already added
  if (request.headers.has(config.key) || request.url.query.get(config.key)) {
    return;
  }

  // return same request if apikey header or query param is already added
  if (request.headers.has(config.key) || request.url.query.get(config.key)) {
    return;
  }

  // if api key `key` is empty then dont add
  if (config.key === '') {
    return;
  }

  // if apikey auth intype is query params
  if (config.in === 'query') {
    // adding new query param to request for api key
    request.url.addQueryParams(new sdk.QueryParam({
      key: config.key,
      value: config.value
    }));
  }
  // if apikey auth intype is headers
  else {
    // adding apikey auth headers to request
    request.addHeader(new sdk.Header({
      key: config.key,
      value: config.value
    }));
  }
}

/**
 * Adds Authorization header for bearer authorization
 * Authorization: Bearer bearer_token
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 */
function bearerToken (request, auth) {
  // return if auth headers are already added
  if (request.headers.has('authorization')) {
    return;
  }

  // get auth options in key value pair format
  let config = getConfig(auth);

  // if bearer token is empty then dont add
  if (config.token === '') {
    return;
  }

  // Adds Authorizaition: Bearer token_value to request
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: 'Bearer ' + config.token
  }));
}

/**
 * Adds Authorization header for basic authorization
 * Authorization: basic buagwdnasdw==
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 */
function basic (request, auth) {
  // return if auth headers are already added
  if (request.headers.has('authorization')) {
    return;
  }

  // get auth options in key value pair format
  let config = getConfig(auth);

  /**
   * Authorization header:
   *  Basic base64(username:password)
   */
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: 'Basic ' + toBase64(`${config.username}:${config.password}`)
  }));
}

/**
 * Authorizes a postman-request instance
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 */
function authorize (request, auth) {
  // checking for auth type and invoking related method
  switch (auth.type) {
    case 'apikey':
      apiKey(request, auth);
      break;

    case 'bearer':
      bearerToken(request, auth);
      break;

    case 'basic':
      basic(request, auth);
      break;

    case 'hawk':
      hawk(request, auth);
      break;

    default:
      throw errors.INVALID_AUTH_TYPE;
  }
}

module.exports = {
  authorize
};
