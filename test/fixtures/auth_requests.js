const sdk = require('postman-collection');

module.exports = {
  'API_KEY': {
    'KEY_VAL_HEADER': new sdk.Request({
      'url': {
        'protocol': 'https',
        'path': ['get'],
        'host': ['postman-echo', 'com'],
        'query': [{
          'key': 'foo1',
          'value': 'bar1'
        }, {
          'key': 'foo2',
          'value': 'aa'
        }],
        'variable': []
      },
      'method': 'GET',
      'auth': {
        'type': 'apikey',
        'apikey': [{
          'type': 'any',
          'value': 'header',
          'key': 'in'
        }, {
          'type': 'any',
          'value': 'key',
          'key': 'key'
        }, {
          'type': 'any',
          'value': 'value',
          'key': 'value'
        }]
      }
    })
  }
};
