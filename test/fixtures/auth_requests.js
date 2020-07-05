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
    }),
    'KEY_HEADER': new sdk.Request({
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
          'value': '',
          'key': 'value'
        }]
      }
    }),
    'HEADER': new sdk.Request({
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
          'value': 'query',
          'key': 'in'
        }, {
          'type': 'any',
          'value': '',
          'key': 'key'
        }, {
          'type': 'any',
          'value': 'val',
          'key': 'value'
        }]
      }
    }),
    'KEY_VAL_QUERY': new sdk.Request({
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
          'value': 'query',
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
    }),
    'KEY_QUERY': new sdk.Request({
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
          'value': 'query',
          'key': 'in'
        }, {
          'type': 'any',
          'value': 'key',
          'key': 'key'
        }, {
          'type': 'any',
          'value': '',
          'key': 'value'
        }]
      }
    }),
    'QUERY': new sdk.Request({
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
          'value': 'query',
          'key': 'in'
        }, {
          'type': 'any',
          'value': '',
          'key': 'key'
        }, {
          'type': 'any',
          'value': '',
          'key': 'value'
        }]
      }
    })
  },
  'BEARER_TOKEN': {
    'TOKEN': new sdk.Request({
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
        'type': 'bearer',
        'bearer': [{
          'type': 'any',
          'value': 'testbearertoken',
          'key': 'token'
        }]
      }
    })
  },
  'BASIC': {
    'USERNAME_PASSWORD': new sdk.Request({
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
        'type': 'basic',
        'basic': [{
          'type': 'any',
          'value': 'test',
          'key': 'password'
        }, {
          'type': 'any',
          'value': 'test',
          'key': 'username'
        }]
      }
    }),
    'USERNAME': new sdk.Request({
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
        'type': 'basic',
        'basic': [{
          'type': 'any',
          'value': '',
          'key': 'password'
        }, {
          'type': 'any',
          'value': 'test',
          'key': 'username'
        }]
      }
    }),
    'PASSWORD': new sdk.Request({
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
        'type': 'basic',
        'basic': [{
          'type': 'any',
          'value': 'test',
          'key': 'password'
        }, {
          'type': 'any',
          'value': '',
          'key': 'username'
        }]
      }
    }),
    'NO_USERNAME_NO_PASS': new sdk.Request({
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
        'type': 'basic',
        'basic': [{
          'type': 'any',
          'value': '',
          'key': 'password'
        }, {
          'type': 'any',
          'value': '',
          'key': 'username'
        }]
      }
    })
  }
};
