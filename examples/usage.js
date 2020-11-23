var generate = require('../index').generate,
  fs = require('fs');

generate({
  type: 'json',
  data: require('./TravefyAPIPublic.postman_collection.json')
}, {
  language: 'Nodejs',
  variant: 'Request',
  variables: {
    'baseApiUrl': '',
    'platformPrivateKey': '',
    'platformPublicKey': '',
    'userId': '',
    'tripId': '',
    'tripPartnerId': '',
    'tripDayId': '',
    'tripUserId': ''
  },
  output: 'string'
}, (err, result) => {
  if (err) {
    console.log(err);
  }
  fs.writeFileSync('TravefyAPIPublic.SDK.js', result.data);
});
