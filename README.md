<a href="https://www.getpostman.com/"><img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-320x132.png" /></a><br />
_Manage all of your organization's APIs in Postman, with the industry's most complete API development environment._

*Supercharge your API workflow.*  
*Modern software is built on APIs. Postman helps you develop APIs faster.*

# postman-collection-code-generators
This library converts Postman Collection into client SDK of chosen language.

Every code generator has two identifiers: `language` and `variant`.
* `language` of a sdk generator is the language in which client SDK is generated.
* `variant` of a sdk generator is the main library name which is used in the generated SDK.

| Language | Variant |
| -------- | ------- |
| Nodejs   | Request |

## Table of contents 

- [postman-collection-code-generators](#postman-collection-code-generators)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Prerequisite](#prerequisite)
  - [Usage](#usage)
    - [Using postman-code-generators as a Library](#using-postman-code-generators-as-a-library)
      - [getLanguageList](#getlanguagelist)
      - [getSDKOptions](#getsdkoptions)
      - [generate](#generate)
  - [Development](#development)
    - [Installing dependencies](#installing-dependencies)
    - [Testing](#testing)
  - [License](#license)

## Getting Started
To get started on you local machine.
```bash
$ git clone https://github.com/postmanlabs/postman-code-generators.git
```

## Prerequisite
To run any of the postman-code-generators, ensure that you have NodeJS >= v12. A copy of the NodeJS installable can be downloaded from https://nodejs.org/en/download/package-manager.

## Usage
### Using postman-code-generators as a Library 
There are three functions that are exposed in postman-code-generators: getLanguageList, getSDKOptions & generate.

#### getLanguageList

```js
let sdkgen = require('pathToSdkgen');

console.log(sdkgen.getLanguageList());
// [ 
//   {
//     name: 'nodejs-request',
//     language: 'nodejs',
//     variant: 'request'
//   } 
//   ...
// ]
```

#### getSDKOptions

General Options

This function takes in two **optional** parameters and returns an Array.

* `language` - language key from the language list returned from getLanguageList function
* `variant` - variant key provided by getLanguageList function

A typical option has the following properties:
* `name` - Display name
* `id` - unique ID of the option
* `type` - Data type of the option. (Allowed data types: `boolean`, `string`)
* `default` - Default value. The value that is used if this option is not specified while creating code snippet
* `availableOptions` - List of available options.
* `required` - Boolean to denote if its a required option
* `description` - User friendly description.

```js
let sdkgen = require('pathToSdkgen');

console.log(sdkgen.getSDKOptions());
// [
//   {
//     name: 'SDK Language',
//     id: 'language',
//     availableOptions: 'Use getSDKOptions method to get list of available sdkgens',
//     type: 'String',
//     default: '',
//     required: true,
//     description: 'Specifies Language for SDK generation'
//   },
//   {
//     name: 'SDK language variant',
//     id: 'variant',
//     availableOptions: 'any',
//     default: '',
//     type: 'String',
//     required: true,
//     description: 'Specifies Language variant for SDK generation'
//   }
//   ...
// ]
```

```js
let sdkgen = require('pathToSdkgen');

console.log(sdkgen.getSDKOptions('nodejs', 'request'));
// [
//   {
//     name: 'Set response return method',
//     id: 'returnMethod',
//     availableOptions: [ 'Callback', 'Promise' ],
//     type: 'String',
//     default: 'Callback',
//     required: false,
//     description: 'Set response return method got http response.'
//   },
//   {
//     name: 'SDK output type',
//     id: 'outputType',
//     availableOptions: [ 'File', 'String' ],
//     type: 'String',
//     default: 'String',
//     required: false,
//     description: 'Specifies Type of Output for the generated SDK'
//   },
//   {
//     name: 'SDK output file name',
//     id: 'outputFilePath',
//     availableOptions: null,
//     type: 'String',
//     default: '/home/wolf/development/postman-collection-code-generators/test/unit',
//     required: false,
//     description: 'Specifies output path for generated SDK'
//   }
//   ...
// ]
```

#### generate
[Collection](https://www.getpostman.com/collections/c8aa0d9bd381c73c5ac3) / 
[Output](https://gist.github.com/someshkoli/b30a70d02ef105e02a754852542a1abf)
```js
let sdkgen = require('pathToSdkgen');

sdkgen.generate({
  type: 'string',
  source: 'https://www.getpostman.com/collections/c8aa0d9bd381c73c5ac3'
}, {
  language: 'Nodejs',
  variant: 'request',
}, (err, snippet) => {
  if (err) return console.log(err);
  console.log(snippet);
});
```

## Development


### Installing dependencies
This command will install all the dependencies in production mode.
```bash
$ npm install
```
To install dev dependencies also for all codegens run: 
```bash
$ npm run deepinstall
```
### Testing 
To run common repo test as well as tests for all sdkgens
```bash
$ npm test
```
To run structure and individual tests on a single codegen
```bash
$ npm test <sdken-name>;
# Here "codege-name" is the folder name of the codegen inside codegens folder
```


## License
This software is licensed under Apache-2.0. Copyright Postman, Inc. See the [LICENSE.md](LICENSE.md) file for more information.
