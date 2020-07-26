const sdk = require('postman-collection');
const { getAuthOptions } = require('./utils');

/**
 * Adds necessary headers/query for aws Authorization
 *
 * @param {sdk.Request} request - Request Instance
 * @param {sdk.RequestAuth} auth - Auth that needs to be applied to the given request
 */
function hawk (request, auth) {

  // return same request if auth headers are already added
  if (request.headers.has('authorization')) {
    return request;
  }

  let config = getAuthOptions(auth);

  if (config.addAuthDataToQuery) {
    /**
     * Replacing url with temporary url
     * Since aws requires timestamp to build signature,
     * this header is further replaced with query/url generating snippet
     * Currently adding _parent-id_HAWK_parent-id_ as header (item Id)
     */
    request.url.getRemote();
    request.url = `_${request._parent_id}_AWS_${request._parent_id}_`;
  }
  else {
    /**
     * Adding aws headers to request
     * Since aws header requires timestamp to build signature,
     * this header is further replaced with query generating snippet
     * Currently addiing _parent-id_HAWK_parent-id_ as header (item Id)
     */
    request.addHeader(new sdk.Header({
      key: 'Authorization',
      value: `_${request._parent_id}_AWS_${request._parent_id}_`
    }));

    // adding host header to request
    request.addHeader(new sdk.Header({
      key: 'Authorization',
      value: `_${request._parent_id}_AWS_${request._parent_id}_`
    }));
  }
}

module.exports = hawk;
