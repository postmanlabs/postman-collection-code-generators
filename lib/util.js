const sdk = require('postman-collection');

module.exports = {

    /**
     * Fetched json from a file

     * @param {String} path - path to the file
     * @param {Function} callback - callback function to return result
     */
    fetchJson: (path, callback) => {
        var jsonText;
        try {
            jsonText = require(path);
        }
        catch (error) {
            return callback(error, null);
        }
        return callback(null, jsonText);
    },

    /**
     * Converts postman collection JSON to postman collection instance

     * @param {Object} collection - Collection object
     * @param {Function} callback - callback function to return results
     */
    parseCollection: (collection, callback) => {
        var postmanCollection;
        try {
            postmanCollection = new sdk.Collection(collection);
        }
        catch (error) {
            return callback(error, null);
        }
        callback(null, postmanCollection);
    }
}