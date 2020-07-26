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

  // Hawk Authorization required elements
  authId = config.authId;
  authKey = config.authKey;
  algorithm = config.algorithm;


  // Hawk Authorization optional elements
  ts = config.timestamp || getTimeStamp().toString();
  nonce = config.nonce || randomString(6);
  ext = config.extraData || '';
  app = config.app || '';
  dlg = config.delegation || '';

  // other elements
  method = request.method;
  uri = '/' + request.url.path.join('/') +
    (request.url.query ? '?' + sdk.QueryParam.unparse(request.url.query.members) : '');
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
   *  - hash - if not present then append ''
   *  - [ext] - append '' if not present
   *  - [app] - append '' if not present
   *  - [dlg] - apend '' if not present; only if app is present
   * All these parameters are newline saperated
   */
  // TODO add body hash; currently set to null
  hawkNormalizedStringArray = [HAWK_HEADER, ts, nonce, method, uri, host, port, ''];

  // add extra app data after escaping required characters
  if (ext) { hawkNormalizedStringArray.push(ext.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')); }

  // creating a \n saperated string with abouve parameterws
  hawkNormalizedString = hawkNormalizedStringArray.join('\n') + '\n';

  // adding delegation id provided
  if (app) { hawkNormalizedString += app + '\n' + (dlg || '') + '\n'; }

  /**
   * MAC calculation done with hmac with secret as authKey and input string as normalized string
   */
  mac = hmac(authKey, hawkNormalizedString, algorithm).digest('base64');

  /**
   * Hawk header contains the following data unquoted saperated by comma and space
   * Header Contains:
   *  - AuthId
   *  - ts(timestamp)
   *  - nonce
   *  - mac (calculation shown below)
   *  - [ext] - Extra app data
   *  - [app] - App id
   *  - [dlg](only if app is available) - delegated by
   */
  hawkHeaderValue = `Hawk id="${authId}", ts="${ts}", nonce="${nonce}", `;
  hawkHeaderValue += ext ? `ext="${ext}", ` : '';
  hawkHeaderValue += `mac="${mac}"`;
  hawkHeaderValue += app ? `, app="${app}", ` +
    (dlg ? `dlg="${dlg}"` : '') : '';

  // Adding hawk header to request
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: hawkHeaderValue
  }));
  return request;
}

module.exports = hawk;
