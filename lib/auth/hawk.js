const sdk = require('postman-collection'),
  {
    randomString,
    hash,
    toBase64
  } = require('../helpers');

/**
 * Adds necessary headers for Hawk Authorization
 * Uses a hashed string called MAC (Message Authentication Code) to authorize requests
 *
 * @param {PostmanRequest} request - Postman Request instance
 * @returns {PostmanRequest} Request Instance with added authorized headers/params
 * TODO add tests for hawk auth
 * TODO add auth requests for hawk auth
 */
function hawk (request) {
  let config = {},
    auth = request.auth,
    HAWK_HEADER = 'hawk.1.header',
    nonce, hawkNormalizedString,
    uri, host, method, port,
    mac, hawkHeaderValue, ts;
  // TODO add desc for header
  // creating congif obj for easy access of elements
  auth.hawk.each((element) => {
    config[element.key] = element.value;
  });

  // if Authid and Authkey is not provided return without change
  if (!config.authId || !config.authKey) {
    return request;
  }

  // Hawk Authorization elements
  ts = config.timestamp || new Date().getTime();
  nonce = config.nonce || randomString(8);
  method = request.method;
  uri = '/' + sdk.QueryParam.unparse(request.url.query.members);
  host = request.url.host.join('.');
  port = '443';

  /**
   * This is a normalised string containg the following elements
   *  - 'hawk.1.header'
   *  - time stamp
   *  - nonce
   *  - METHOD
   *  - path
   *  - host
   *  - 443
   * All these parameters are newline saperated
   */
  hawkNormalizedString = [HAWK_HEADER, ts, nonce, method, uri, host, port].join('\n');

  /**
   * MAC calculation done with hmac with secret as authKey and input string as normalized string
   */
  mac = toBase64(hash.hmac(config.authKey, hawkNormalizedString, config.algorithm));

  /**
   * Hawk header contains the following data unquoted saperated by comma and space
   * Header Contains:
   *  - AuthId
   *  - ts(timestamp)
   *  - nonce
   *  - mac (calculation shown below)
   *  - [username]
   *  - [ext] - Extra app data
   *  - [app] - App id
   *  - [dlg] - delegated by
   */
  hawkHeaderValue = `Hawk id=${config.authId}, ts=${ts}, nonce=${nonce}, mac=${mac}`;
  hawkHeaderValue += config.extraData ? ` ext=${config.extraData}` : '';
  hawkHeaderValue += config.app ? ` app=${config.app}` : '';
  hawkHeaderValue += config.delegation ? ` dlg=${config.delegation}` : '';

  // Adding hawk header to request
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: hawkHeaderValue
  }));
  return request;
}

module.exports = hawk;
