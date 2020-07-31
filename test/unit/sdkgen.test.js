/* eslint-disable max-len */
const expect = require('chai').expect,
  sdkgen = require('../../'),
  sdk = require('postman-collection'),
  collections = {
    SDKGEN: require('../fixtures/SDKGEN.postman_collection.json')
  };
describe('Generate function', () => {

  it('should generate sdk snippet without outputType option', () => {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'request'
    }, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should generate sdk snippet with outputType as String', () => {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'String'
    }, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should generate sdk snippet with outputType as File', () => {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'file',
      // ../sdk.js resolves to root folder because this file is being called from npm folder
      outputFilePath: '../sdk.js'
    }, (err, output) => {
      expect(err).to.be.null;
      expect(output).to.include('File exported at location:');
    });
  });

  it('should throw an error if outputfilepath is invalid', () => {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'file',
      outputFilePath: '../'
    }, (err, output) => {
      expect(err).not.to.be.null;
      expect(output).to.be.null;
    });
  });

  it('should generate sdk snippet with source as collection json', () => {
    sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'request'
    }, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  it('should generate sdk snippet with source as PostmanCollection instance', () => {
    let collection = new sdk.Collection(collections.SDKGEN);
    sdkgen.generate({
      type: 'json',
      source: collection
    }, {
      language: 'Nodejs',
      variant: 'request'
    }, (err, snippet) => {
      expect(err).to.be.null;
      expect(snippet).to.include('request = require(\'request\')');
    });
  });

  // TODO fix issue with response resolution
  it('should generate sdk snippet with source as url', () => {
    sdkgen.generate(
      {
        type: 'string',
        source: 'https://www.getpostman.com/collections/4a7c7e33aa5dc9dd11b1'
      }, {
        language: 'Nodejs',
        variant: 'request'
      }, (err, snippet) => {
        expect(err).to.be.null;
        expect(snippet).to.include('request = require(\'request\')');
      });
  });


  it('should throw an error if invalid colleciton source is provided', () => {
    sdkgen.generate('random letters', {
      language: 'Nodejs',
      variant: 'request'
    }, (err, snippet) => {
      expect(snippet).to.be.null;
      expect(err);
    });
  });
});
