'use strict';

var crypto = require('crypto'),
  Buffer = require('safe-buffer').Buffer;

/**
 * Converts String to base64 equivalent
 *
 * @param {string} str - Input string
 * @returns {string} - Base64 converted input string
 */
function toBase64 (str) {
  return Buffer.from(str || '', 'utf8').toString('base64');
}

/**
 * Creats a deep copy of an object;
 *
 * @param {object} object - Input Object
 * @returns {object} - copy of input object
 */
function copy (object) {
  var objectCopy = {};
  Object.keys(object).forEach(function (i) {
    objectCopy[i] = object[i];
  });
  return objectCopy;
}

/**
 * Creates md5 hash for input string
 *
 * @param str - String whose md5 hash has to be calculated
 * @returns {string} - md5 hash of input string
 */
function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Creates sha256 hash for input string
 *
 * @param str - String whose md5 hash has to be calculated
 * @returns {string} - md5 hash of input string
 */
function sha256 (str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Creates sha512 hash for input string
 *
 * @param str - String whose md5 hash has to be calculated
 * @returns {string} - md5 hash of input string
 */
function sha512 (str) {
  return crypto.createHash('sha512').update(str).digest('hex');
}

/**
 * Creates a HMAC hash with input secter key and algorithm
 *
 * @param secret - Secret key
 * @param helper - String whose hash has to be calculated
 * @param algorithm - algorithm to be used
 */
function hmac (secret, helper, algorithm) {
  return crypto.createHmac(algorithm, secret).update(helper);
}

/**
 * Method to return current time stamp
 *
 * @returns {number} timestamp
 */
function getTimeStamp () {
  return Math.floor(Date.now() / 1000);
}

/**
 * Function to return random string of desired length
 *
 * @param length
 * @returns {string} random string
 */
function randomString (length) {
  return Math.random().toString(36).substring(length);

}
module.exports = {
  hash: {
    md5,
    sha256,
    sha512,
    hmac
  },
  hmac,
  toBase64,
  copy,
  getTimeStamp,
  randomString
};
