const sdk = require('postman-collection');

/**
 * Adds necessary headers for Hawk Authorization
 *
 * @param {sdk.Request} request - Request Instance
 */
function hawk (request) {

  // return same request if auth headers are already added
  if (request.headers.has('authorization')) {
    return request;
  }

  /**
   * Adding hawk headers to requesr
   * Since hawk header requires timestamp to build mac this header is further replaced with header generating snippet
   * Currently addiing _parent-id_HAWK_parent-id_ as header (item Id)
   */
  request.addHeader(new sdk.Header({
    key: 'Authorization',
    value: `_${request._parent_id}_HAWK_${request._parent_id}_`
  }));

}

module.exports = hawk;
