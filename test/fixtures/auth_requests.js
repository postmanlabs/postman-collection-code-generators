const {
  sortedLastIndex
} = require('lodash');
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
<<<<<<< HEAD
    // if only api key is given with input type as header
=======
>>>>>>> 3edcc7e... Completes API key authorizer
=======
    // if only api key is given with input type as header
>>>>>>> 883f0d9... Adds necessary comments to auth_requests
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
<<<<<<< HEAD
    // if api key is not given and input type is header
=======
>>>>>>> 3edcc7e... Completes API key authorizer
=======
    // if api key is not given and input type is header
>>>>>>> 883f0d9... Adds necessary comments to auth_requests
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
<<<<<<< HEAD
    // if api key and value are given with in type as query params
=======
>>>>>>> 3edcc7e... Completes API key authorizer
=======
    // if api key and value are given with in type as query params
>>>>>>> 883f0d9... Adds necessary comments to auth_requests
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
<<<<<<< HEAD
    // if only api key is given with input type as query param
=======
>>>>>>> 3edcc7e... Completes API key authorizer
=======
    // if only api key is given with input type as query param
>>>>>>> 883f0d9... Adds necessary comments to auth_requests
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
<<<<<<< HEAD
    // if neither api key or value is given with in type as query param
=======
>>>>>>> 3edcc7e... Completes API key authorizer
=======
    // if neither api key or value is given with in type as query param
>>>>>>> 883f0d9... Adds necessary comments to auth_requests
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

  // oauth 2.0
  'OAUTH2': {
    'TOKEN_HEADER_PREFIX': new sdk.Request({
      'description': {
        // eslint-disable-next-line max-len
        'content': 'The HTTP `GET` request method is meant to retrieve data from a server. The data\nis identified by a unique URI (Uniform Resource Identifier). \n\nA `GET` request can pass parameters to the server using "Query String \nParameters". For example, in the following request,\n\n> http://example.com/hi/there?hand=wave\n\nThe parameter "hand" has the value "wave".\n\nThis endpoint echoes the HTTP headers, request parameters and the complete\nURI requested.',
        'type': 'text/plain'
      },
      'url': {
        'protocol': 'https',
        'path': ['get'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'method': 'GET',
      'auth': {
        'type': 'oauth2',
        'oauth2': [{
          'type': 'any',
          'value': 'token',
          'key': 'accessToken'
        }, {
          'type': 'any',
          'value': 'header',
          'key': 'addTokenTo'
        }, {
          'type': 'any',
          'value': 'Bearer ',
          'key': 'headerPrefix'
        }]
      }
    }),
    'TOKEN_URL_PREFIX': new sdk.Request({
      'description': {
        // eslint-disable-next-line max-len
        'content': 'The HTTP `GET` request method is meant to retrieve data from a server. The data\nis identified by a unique URI (Uniform Resource Identifier). \n\nA `GET` request can pass parameters to the server using "Query String \nParameters". For example, in the following request,\n\n> http://example.com/hi/there?hand=wave\n\nThe parameter "hand" has the value "wave".\n\nThis endpoint echoes the HTTP headers, request parameters and the complete\nURI requested.',
        'type': 'text/plain'
      },
      'url': {
        'protocol': 'https',
        'path': ['get'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'method': 'GET',
      'auth': {
        'type': 'oauth2',
        'oauth2': [{
          'type': 'any',
          'value': 'token',
          'key': 'accessToken'
        }, {
          'type': 'any',
          'value': 'queryParams',
          'key': 'addTokenTo'
        }, {
          'type': 'any',
          'value': 'Bearer ',
          'key': 'headerPrefix'
        }]
      }
    }),
    'WITHOUT_TOKEN': new sdk.Request({
      'description': {
        // eslint-disable-next-line max-len
        'content': 'The HTTP `GET` request method is meant to retrieve data from a server. The data\nis identified by a unique URI (Uniform Resource Identifier). \n\nA `GET` request can pass parameters to the server using "Query String \nParameters". For example, in the following request,\n\n> http://example.com/hi/there?hand=wave\n\nThe parameter "hand" has the value "wave".\n\nThis endpoint echoes the HTTP headers, request parameters and the complete\nURI requested.',
        'type': 'text/plain'
      },
      'url': {
        'protocol': 'https',
        'path': ['get'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'method': 'GET',
      'auth': {
        'type': 'oauth2',
        'oauth2': [{
          'type': 'any',
          'value': '',
          'key': 'accessToken'
        }, {
          'type': 'any',
          'value': 'queryParams',
          'key': 'addTokenTo'
        }]
      }
    }),
    'TOKEN_HEADER': new sdk.Request({
      'description': {
        // eslint-disable-next-line max-len
        'content': 'The HTTP `GET` request method is meant to retrieve data from a server. The data\nis identified by a unique URI (Uniform Resource Identifier). \n\nA `GET` request can pass parameters to the server using "Query String \nParameters". For example, in the following request,\n\n> http://example.com/hi/there?hand=wave\n\nThe parameter "hand" has the value "wave".\n\nThis endpoint echoes the HTTP headers, request parameters and the complete\nURI requested.',
        'type': 'text/plain'
      },
      'url': {
        'protocol': 'https',
        'path': ['get'],
        'host': ['postman-echo', 'com'],
        'query': [],
        'variable': []
      },
      'method': 'GET',
      'auth': {
        'type': 'oauth2',
        'oauth2': [{
          'type': 'any',
          'value': 'token',
          'key': 'accessToken'
        }, {
          'type': 'any',
          'value': 'header',
          'key': 'addTokenTo'
        }, {
          'type': 'any',
          'value': '',
          'key': 'headerPrefix'
        }]
      }
    })
  }
};
