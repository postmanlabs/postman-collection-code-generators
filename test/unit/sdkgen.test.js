/* eslint-disable max-len */
const expect = require('chai').expect,
  sdkgen = require('../../'),
  sdk = require('postman-collection'),
  collections = {
    SDKGEN: require('../fixtures/SDKGEN.postman_collection.json')
  };
describe('Generate function', () => {

  it('should generate sdk snippet without outputType option', async () => {
    await sdkgen.generate({
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

  it('should generate sdk snippet with outputType as String', async () => {
    await sdkgen.generate({
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

  it('should generate sdk snippet with outputType as File', async () => {
    await sdkgen.generate({
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

  it('should throw an error if outputfilepath is invalid', async () => {
    await sdkgen.generate({
      type: 'json',
      source: collections.SDKGEN
    }, {
      language: 'Nodejs',
      variant: 'request',
      outputType: 'file',
      outputFilePath: '../'
    }, (err) => {
      expect.fail(null, null, err);
    });
  });

  it('should generate sdk snippet with source as collection json', async () => {
    await sdkgen.generate({
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

  it('should generate sdk snippet with source as PostmanCollection instance', async () => {
    let collection = new sdk.Collection(collections.SDKGEN);
    await sdkgen.generate({
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
  it('should generate sdk snippet with source as url', async () => {
    await sdkgen.generate(
      {
        type: 'string',
        source: 'https://www.getpostman.com/collections/c8aa0d9bd381c73c5ac3'
      }, {
        language: 'Nodejs',
        variant: 'request'
      }, (err, snippet) => {
        expect(err).to.be.null;
        expect(snippet).to.include('request = require(\'request\')');
      });
  });


  it('should throw an error if invalid colleciton source is provided', async () => {
    await sdkgen.generate('random letters', {
      language: 'Nodejs',
      variant: 'request'
    }, (err) => {
      expect(err);
    });
  });
});
