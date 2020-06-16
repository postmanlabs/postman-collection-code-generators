/* eslint-disable one-var */
const SDKNAME = require('./sdk');

var sdk1 = new SDKNAME({
  eee: 'eee',
  fff: 'fff',
  aaa: 'testing',
  variable_key: 'somesh'
});
console.log(sdk1);
sdk1.requests["Postman Echo"]["Request Methods"]["GET Request"]((err, res) => {
  if (err) {
    console.log(err);
  }
  console.log(res.body);
})