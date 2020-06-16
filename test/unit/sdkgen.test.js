/* eslint-disable max-len */
const expect = require('chai').expect,
  sdkgen = require('../../'),
  postmanEchoCollection = require('../fixtures/Postman Echo.postman_collection.json'),
  sdk = require('postman-collection');
describe('Generate function', () => {

  it('should generate sdk snippet without outputType option', () => {
    sdkgen.generate(postmanEchoCollection, {
      language: 'Nodejs',
      variant: 'request'
    }, {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should generate sdk snippet with outputType as String', () => {
    sdkgen.generate(postmanEchoCollection, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'String'
    }, {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should generate sdk snippet with outputType as File', () => {
    sdkgen.generate(postmanEchoCollection, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'File',
      // ../sdk.js resolves to root folder because this file is being called from npm folder
      outputFilePath: '../sdk.js'
    }, {}, (err, output) => {
      expect(err).to.be.null;
      expect(output).to.include('File exported at location:');
    });
  });

  it('should throw an error if outputfilepath is invalid', () => {
    sdkgen.generate(postmanEchoCollection, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'File',
      outputFilePath: '../'
    }, {}, (err, output) => {
      expect(err).not.to.be.null;
      expect(output).to.be.null;
    });
  });

  it('should generate sdk snippet with source as collection json', () => {
    sdkgen.generate(postmanEchoCollection, {
      language: 'Nodejs',
      variant: 'request'
    }, {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should generate sdk snippet with source as PostmanCollection instance', () => {
    var collection = new sdk.Collection(postmanEchoCollection);
    sdkgen.generate(collection, {
      language: 'Nodejs',
      variant: 'request'
    }, {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  // TODO fix issue with response resolution
  // it('should generate sdk snippet with source as url', () => {
  //   sdkgen.generate('https://www.getpostman.com/collections/4a7c7e33aa5dc9dd11b1', {
  //     language: 'Nodejs',
  //     variant: 'request'
  //   }, {}, (err, snippet) => {
  //     expect(err).to.be.null;
  //     expect(snippet).to.include('request = require(\'request\')');
  //   });
  // });

  it('should generate sdk snippet with source as file path', () => {
    // here the path is `../test/fix....` because the calling file is in npm/
    sdkgen.generate('../test/fixtures/Postman Echo.postman_collection.json', {
      language: 'Nodejs',
      variant: 'request'
    }, {}, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should throw an error if invalid colleciton source is provided', () => {
    sdkgen.generate('random letters', {
      language: 'Nodejs',
      variant: 'request'
    }, {}, (err, snippet) => {
      expect(snippet).to.be.null;
      expect(err);
    });
  });

  // TODO update this test for better approach
  it('should generate sdk according to codegenoptions provided', () => {
    var options = {
      indentType: 'Tab',
      indentCount: 2,
      followRediredirect: false,
      trimRequestBody: true,
      requestTimeout: 0,
      SDKGEN_enabled: true
    };
    sdkgen.generate(postmanEchoCollection, {
      language: 'Nodejs',
      variant: 'request'
    }, options, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('\t\t');
    });
  });
});
