const sdk = require('postman-collection'),
  uuid = require('uuid/v4'),
  crypto = require('crypto'),
  helpers = require('./helpers');

var toBase64 = helpers.toBase64,
  hash = helpers.hash;

/**
 * Adds necessary headers / url params for api key authentication
 * In header -> key:value
 * In query param -> url?key=value
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
 * Adds Authorization header for basic authorization
 * RFC 7616: Extended version of RFC 2617 but is backward compatible with it.
 * reference: https://tools.ietf.org/html/rfc7616
 *
 * @param request - Postman Request instance
 * @returns {PostmanRequest} Request Instance with added authorized headers/params
 */
function digest (request) {
  let config = {},
    auth = request.auth,
    username, password, realm, nonce, uri,
    algorithm, qop, ncount, cnonce, opaque, A1, A2, response, authHeaderValue;

  // TODO add desc for header
  // creating congif obj for easy access of elements
  auth.digest.each((element) => {
    config[element.key] = element.value;
  });

  // if username or password is not given then dont add any auth headers
  if (config.username === '' || config.password === '') {
    return request;
  }

  // elements of digest auth
  username = config.username;
  password = config.password;
  realm = config.realm ? config.realm : 'testrealm@example.com';
  nonce = config.ncount ? config.ncount : toBase64(crypto.randomBytes(8));
  // changing algorithm format by removing '-' and converting to lowercase
  // for better access from helpers
  algorithm = config.algorithm.replace(/-/g, '') ? config.algorithm.toLowerCase() : 'md5';
  qop = config.qop ? config.qop : 'auth-init';
  ncount = config.ncount ? config.ncount : '00000001';
  cnonce = config.cnounce ? config.cnounce : uuid().replace(/-/g, '');
  uri = '/' + request.url.path.join('/') + '?' + sdk.QueryParam.unparse(request.url.query.members);
  opaque = config.opaque;

  /**
   * A1 calculation according to RFC 7616
   */
  if (algorithm.match(/[.]*-sess/g)) {
    /**
     * A1 calculation for algorithms with -sess (session)
     * Algorithms: MD5-sess, SHA-256-sess, SHA-512-sess
     * A1 = <algorithm>(username : realm : password) : ncount : cnonce
     */
    A1 = hash[algorithm](username + ':' + realm + ':' + password) + ':' + ncount + ':' + cnonce;
  }
  else {
    /**
     * A1 calculation for algorithms with -sess (session)
     * Algorithms: MD5, SHA-256, SHA-512
     * A1 = <algorithm>(username : realm : password)
     */
    A1 = username + ':' + realm + ':' + password;
  }

  /**
   * A2 calculation according to RFC 7616
   */
  if (qop === 'auth') {
    /**
     * If qop = auth or undefined:
     *    A2 = method : request-uri
     */
    A2 = request.method + ':' + request.url;
  }
  else if (qop === 'auth-init') {
    /**
     * if qop = auth-init:
     *    A2 = method : request-uri : <algorithm>(entity-body)
     */
    // TODO find what is body-entity
  }

  /**
   * Calculation of response as per RFC 7616
   * response = <algorithm>(<algorithm>(A1) : nonce : ncount : cnonce : qop : <algorithm>(A2))
   * where <algorithm>() hashes input string with given algorithm
   */
  response = hash[algorithm](hash[algorithm](A1) + ':' +
                            nonce + ':' +
                            ncount + ':' +
                            cnonce + ':' +
                            qop + ':' +
                            hash[algorithm](A2));

  /**
   * Digest Auth header value
   * Contains:
   *  - username
   *  - realm
   *  - nonce
   *  - uri
   *  - [algorithm] - default(MD5)
   *      -- Format "ALGONAME-VARIANT" + "-sess" (if session tag is required)
   *  - [qop] - default (auth)
   *  - nc
   *  - cnonce
   *  - opaque
   */
  authHeaderValue = `Digest username="${username}", realm="${realm}", nonce="${nonce}",  uri="${uri}",`;
  authHeaderValue += ` algorithm="${config.algorithm}", qop="${qop}", nc="${ncount}",`;
  authHeaderValue += ` cnonce="${cnonce}", response="${response}"`;
  authHeaderValue += opaque ? ` opaque="${opaque}"` : '';

  // Adding digest auth header to request
  request.addHeader(new sdk.Header({
    key: 'Authentication',
    value: authHeaderValue
  }));

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
  else {
    // TODO return legit err
    console.log('return err');
  }
  return authorizedRequest;
}

module.exports = authorize;
