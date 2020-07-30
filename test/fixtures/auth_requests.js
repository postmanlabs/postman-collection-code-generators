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
    // if only api key is given with input type as header
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
    // if api key is not given and input type is header
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
    // if api key and value are given with in type as query params
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
    // if only api key is given with input type as query param
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
    // if neither api key or value is given with in type as query param
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
    })
  },
  'AWSV4': {
    'NO_ACCESSKEY_NO_SECRET': new sdk.Request({
      'url': {
        'protocol': 'https',
        'path': ['post'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'header': [{
        'key': 'Content-Length',
        'value': '22'
      }],
      'method': 'POST',
      'body': {
        'mode': 'formdata',
        'formdata': [{
          'key': 'awdawd',
          'value': 'awdawd',
          'type': 'text'
        }, {
          'disabled': true,
          'key': '',
          'value': '',
          'type': 'file',
          'src': '/home/wolf/Pictures/arch.png'
        }]
      },
      'auth': {
        'type': 'awsv4',
        'awsv4': [{
          'type': 'any',
          'value': '',
          'key': 'accessKey'
        }, {
          'type': 'any',
          'value': false,
          'key': 'addAuthDataToQuery'
        }, {
          'type': 'any',
          'value': '',
          'key': 'region'
        }, {
          'type': 'any',
          'value': '',
          'key': 'secretKey'
        }, {
          'type': 'any',
          'value': '',
          'key': 'service'
        }, {
          'type': 'any',
          'value': '',
          'key': 'sessionToken'
        }]
      }
    }),
    'ACCESSKEY_SECRET': new sdk.Request({
      'url': {
        'protocol': 'https',
        'path': ['post'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'header': [{
        'key': 'Content-Length',
        'value': '22'
      }],
      'method': 'POST',
      'body': {
        'mode': 'formdata',
        'formdata': [{
          'key': 'awdawd',
          'value': 'awdawd',
          'type': 'text'
        }, {
          'disabled': true,
          'key': '',
          'value': '',
          'type': 'file',
          'src': '/home/wolf/Pictures/arch.png'
        }]
      },
      'auth': {
        'type': 'awsv4',
        'awsv4': [{
          'type': 'any',
          'value': 'KEY',
          'key': 'accessKey'
        }, {
          'type': 'any',
          'value': false,
          'key': 'addAuthDataToQuery'
        }, {
          'type': 'any',
          'value': '',
          'key': 'region'
        }, {
          'type': 'any',
          'value': 'SECRET',
          'key': 'secretKey'
        }, {
          'type': 'any',
          'value': '',
          'key': 'service'
        }, {
          'type': 'any',
          'value': '',
          'key': 'sessionToken'
        }]
      }
    }),
    'ACCESS_KEY_ADAVANCE_PARAM': new sdk.Request({
      'url': {
        'protocol': 'https',
        'path': ['post'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'header': [{
        'key': 'Content-Length',
        'value': '22'
      }],
      'method': 'POST',
      'body': {
        'mode': 'formdata',
        'formdata': [{
          'key': 'awdawd',
          'value': 'awdawd',
          'type': 'text'
        }, {
          'disabled': true,
          'key': '',
          'value': '',
          'type': 'file',
          'src': '/home/wolf/Pictures/arch.png'
        }]
      },
      'auth': {
        'type': 'awsv4',
        'awsv4': [{
          'type': 'any',
          'value': 'KEY',
          'key': 'accessKey'
        }, {
          'type': 'any',
          'value': false,
          'key': 'addAuthDataToQuery'
        }, {
          'type': 'any',
          'value': 'in-east-1',
          'key': 'region'
        }, {
          'type': 'any',
          'value': 'SECRET',
          'key': 'secretKey'
        }, {
          'type': 'any',
          'value': 's4',
          'key': 'service'
        }, {
          'type': 'any',
          'value': 'session',
          'key': 'sessionToken'
        }]
      }
    }),
    'ACCESSKEY_SECRET_SESSION': new sdk.Request({
      'url': {
        'protocol': 'https',
        'path': ['post'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'header': [{
        'key': 'Content-Length',
        'value': '22'
      }],
      'method': 'POST',
      'body': {
        'mode': 'formdata',
        'formdata': [{
          'key': 'awdawd',
          'value': 'awdawd',
          'type': 'text'
        }, {
          'disabled': true,
          'key': '',
          'value': '',
          'type': 'file',
          'src': '/home/wolf/Pictures/arch.png'
        }]
      },
      'auth': {
        'type': 'awsv4',
        'awsv4': [{
          'type': 'any',
          'value': 'KEY',
          'key': 'accessKey'
        }, {
          'type': 'any',
          'value': false,
          'key': 'addAuthDataToQuery'
        }, {
          'type': 'any',
          'value': 'in-east-1',
          'key': 'region'
        }, {
          'type': 'any',
          'value': 'SECRET',
          'key': 'secretKey'
        }, {
          'type': 'any',
          'value': 's4',
          'key': 'service'
        }, {
          'type': 'any',
          'value': 'session',
          'key': 'sessionToken'
        }]
      }
    }),
    'ALL_PARAM_IN_QUERY': new sdk.Request({
      'url': {
        'protocol': 'https',
        'path': ['post'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'header': [{
        'key': 'Content-Length',
        'value': '22'
      }],
      'method': 'POST',
      'body': {
        'mode': 'formdata',
        'formdata': [{
          'key': 'awdawd',
          'value': 'awdawd',
          'type': 'text'
        }, {
          'disabled': true,
          'key': '',
          'value': '',
          'type': 'file',
          'src': '/home/wolf/Pictures/arch.png'
        }]
      },
      'auth': {
        'type': 'awsv4',
        'awsv4': [{
          'type': 'any',
          'value': 'KEY',
          'key': 'accessKey'
        }, {
          'type': 'any',
          'value': true,
          'key': 'addAuthDataToQuery'
        }, {
          'type': 'any',
          'value': 'in-east-1',
          'key': 'region'
        }, {
          'type': 'any',
          'value': 'SECRET',
          'key': 'secretKey'
        }, {
          'type': 'any',
          'value': 's4',
          'key': 'service'
        }, {
          'type': 'any',
          'value': 'session',
          'key': 'sessionToken'
        }]
      }
    })
  }
};
