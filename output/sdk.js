/* eslint-disable require-jsdoc */
var request = require('request');
function SDKNAME (environment = null) {

    var self = this;

    this.requests = {
        'Postman Echo Copy': {
            'GET Request 1 ': function (callback) {
                var options = {
                    'method': 'GET',
                    'url': 'https://postman-echo.com/get?foo1=bar1&foo2=' + self.variables.variable_key,
                    'headers': {
                    }
                };
                request(options, function (error, response) {
                    callback(error, response);
                });
            },
            'Request Methods': {
                'GET Request': function (callback) {
                    var options = {
                        'method': 'GET',
                        'url': 'https://postman-echo.com/get?foo1=bar1&test={"test": { "test2" : 1}}',
                        'headers': {
                        }
                    };
                    request(options, function (error, response) {
                        callback(error, response);
                    });
                },
                'POST Raw Text': function (callback) {
                    var options = {
                        'method': 'POST',
                        'url': 'https://postman-echo.com/post',
                        'headers': {
                            'Content-Type': 'image/gif'
                        },
                        body: '{\n\r\t"test" : 1\t\n\r}'

                    };
                    request(options, function (error, response) {
                        callback(error, response);
                    });
                },
                'POST Form Data': function (callback) {
                    var options = {
                        'method': 'POST',
                        'url': 'https://postman-echo.com/post',
                        'headers': {
                        },
                        form: {
                            'foo1': 'bar1',
                            'foo2': 'bar2'
                        }
                    };
                    request(options, function (error, response) {
                        callback(error, response);
                    });
                }
            },
            'Auth: Digest': {
                'DigestAuth Request': function (callback) {
                    var options = {
                        'method': 'GET',
                        'url': 'https://postman-echo.com/digest-auth',
                        'headers': {
                        }
                    };
                    request(options, function (error, response) {
                        callback(error, response);
                    });
                }
            }
        }
    };

    this.variables = {
        aaa: 'aaa',
        bbb: 'bbb',
        ccc: 'ccc',
        ddd: 'ddd'
    };

    SDKNAME.prototype.setVariables = function (variables) {
        Object.keys(variables).forEach((key) => {
            this.variables[key] = variables[key];
        });
        return this.variables;
    };

    this.variables = environment ? this.setVariables(environment) : this.variables;
}

module.exports = SDKNAME;

