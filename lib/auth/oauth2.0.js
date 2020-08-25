const sdk = require('postman-collection'),
  getConfig = require('./utils').getAuthOptions;

/**
 * Adds Authorization header/query for oauth2.0 authorization
 * Authorization: prefix token
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 * @returns {sdk.Request} - Requst with applied auth
 */
function oauth2 (request, auth) {
  let config = getConfig(auth);

  // if access token is  absent then return
  if (!config.accessToken) {
    return request;
  }
  // add to query param if it is set
  if (config.addTokenTo === 'queryParams') {
    request.url.addQueryParams(new sdk.QueryParam({
      key: 'access_token',
      value: config.accessToken
    }));
  }
  // else add to headers as `authorization`
  else {
    request.addHeader(new sdk.Header({
      key: 'Authorization',
      value: config.headerPrefix + config.accessToken
    }));
  }

  return request;
}

module.exports = oauth2;
