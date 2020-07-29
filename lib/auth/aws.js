const sdk = require('postman-collection'),
  getConfig = require('./utils').getAuthOptions,
  aws = require('aws4'),
  {
    hmac
  } = require('../helpers');


/**
 * Adds necessary headers / url params for aws signature 4 authorization
 * Reference: https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
 *
 * @note Does not support requests with form data body type
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 */
function awsAuth(request, auth) {
  let config = getConfig(auth),
    options, signedRequestParams, parsedUrl;

  // adding X-Amz-Security-Token query param if session token is provided
  if (config.sessionToken) {
    request.url.addQueryParams({
      key: 'X-Amz-Security-Token',
      value: config.sessionToken
    });
  }

  /**
   * options required for signing request
   *  - host
   *  - path along with query params
   *  - aws service, if null -> 'execute-api'
   *  - aws region, if null -. 'us-east-1'
   *  - headers (existing headers in the request)
   *  - stringified body (will return for form data and multipart body)
   *  - accessKeyId
   *  - secretAccessKey
   *  - signQuery (add auth data to query params)
   *  - sessionToken
   */
  options = {
    host: request.url.getHost(),
    path: request.url.getPathWithQuery(),
    headers: request.getHeaders(),
    body: request.body ? request.body.toString() : undefined,
    service: config.service || 'execute-api',
    region: config.region || 'us-east-1',
    asccessKeyId: config.accessKey,
    secretAccessKey: config.secretKey,
    sessionToken: config.sessionToken,
    signQuery: config.addAuthDataToQuery
  };

  // signing request with above options
  signedRequestParams = aws.sign(options);

  if(config.addAuthDataToQuery){
    // unparsing path build by aws.sign
    // if session token is provided in the options then it will be added to the path
    parsedUrl = sdk.Url.parse(signedRequestParams.path);
    // repopuating request query params to eliminate unwanted duplication and to add auth query params
    request.url.query.repopulate(parsedUrl.query)
    // adding auth data to headers if addAuthDataToQuery is false
  }
  else {
    request.addHeader({
      key: 'Authorization',
      value: signedRequestParams.headers.Authorization
    });
  }

  return request;
}

module.exports = awsAuth;