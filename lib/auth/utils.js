/**
 * Pulls elements from auth instance and return a json object with all the params
 *
 * @param {sdk.RequestAuth} auth - auth instance
 * @returns {object} - object containing all the auth parametes as key value pairs
 */
function getAuthOptions (auth) {
  let config = {};
  // creating congif obj for easy access of elements
  auth[auth.type].each((element) => {
    config[element.key] = element.value;
  });

  return config;
}

module.exports = {
  getAuthOptions
};
