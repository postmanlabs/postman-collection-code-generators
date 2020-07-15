const sdk = require('postman-collection'),
  {
    hash,
    toBase64
  } = require('../helpers');

/**
 * Adds Authorization header for Digest authorization
 * RFC 7616: Extended version of RFC 2617 but is backward compatible with it.
 *
 * Reference: https://tools.ietf.org/html/rfc7616
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 * TODO add test for digest auth
 * TODO add auth requests for digest auth
 */
function digest (request, auth) {
  let config = {},
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
  realm = config.realm || 'testrealm@example.com';
  nonce = config.ncount || toBase64(ramdomString(8));
  // changing algorithm format by removing '-' and converting to lowercase
  // for better access from helpers
  algorithm = config.algorithm.toLowerCase() || 'md5';
  qop = config.qop || 'auth-init';
  ncount = config.ncount || '00000001';
  cnonce = config.cnounce || toBase64(ramdomString(8));
  uri = '/' + request.url.path.join + sdk.QueryParam.unparse(request.url.query.members);
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
  response = hash[algorithm]([
    hash[algorithm](A1),
    nonce,
    ncount,
    cnonce,
    qop,
    hash[algorithm](A2)
  ].join(':'));

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

module.exports = digest;
