const sdk = require('postman-collection');

/**
 * JSON containing request used for requestAuth testing
 * Format:
 *  root {
 *    auth_method {
 *      PARAMETERS_CAPS_ON : PostmanRequest instance for this auth and config
 *    }
 *  }
 */
module.exports = {

  // api key authorization
  'API_KEY': {
    // if api key & value are given with input type as header
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
<<<<<<< HEAD
    // if only api key is given with input type as header
=======
>>>>>>> 3edcc7e... Completes API key authorizer
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
<<<<<<< HEAD
    // if api key is not given and input type is header
=======
>>>>>>> 3edcc7e... Completes API key authorizer
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
<<<<<<< HEAD
    // if api key and value are given with in type as query params
=======
>>>>>>> 3edcc7e... Completes API key authorizer
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
<<<<<<< HEAD
    // if only api key is given with input type as query param
=======
>>>>>>> 3edcc7e... Completes API key authorizer
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
<<<<<<< HEAD
    // if neither api key or value is given with in type as query param
=======
>>>>>>> 3edcc7e... Completes API key authorizer
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
<<<<<<< HEAD
    })
  },

  // bearer token authorization
  'BEARER_TOKEN': {
    // when bearer token is given
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

  // basic authorization
  'BASIC': {
    // if username password are given
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
    // if only username is given
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
    // if only password is given
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

    // if neither username nor password is given
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
=======
>>>>>>> 3edcc7e... Completes API key authorizer
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
