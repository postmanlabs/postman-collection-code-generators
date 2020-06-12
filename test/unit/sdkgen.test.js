/* eslint-disable max-len */
const expect = require('chai').expect,
    sdkgen = require('../../'),
    postmanEchoCollection = require('../fixtures/Postman Echo.postman_collection.json'),
    sdk = require('postman-collection'),
    sdkOptions = {
        language: 'Nodejs',
        Variant: 'Request'
    };
describe('Generate functon', () => {

    it('should generate sdk snippet with output type option', () => {
        sdkgen.generate(postmanEchoCollection, {
            outputType: 'String'
        }, sdkOptions, (err, snippet) => {
            expect(err).to.be.null;
            expect(snippet).to.include('request = require(\'request\')');
        });
    });

    it('should generate sdk snippet with source as collection json', () => {
        sdkgen.generate(postmanEchoCollection, sdkOptions, {}, (err, snippet) => {
            expect(err).to.be.null;
            expect(snippet).to.include('request = require(\'request\')');
        });
    });

    it('should generate sdk snippet with source as PostmanCollection instance', () => {
        var collection = new sdk.Collection(postmanEchoCollection);
        sdkgen.generate(collection, sdkOptions, {}, (err, snippet) => {
            expect(err).to.be.null;
            expect(snippet).to.include('request = require(\'request\')');
        });
    });

    it('should generate sdk snippet with source as url', () => {
        sdkgen.generate('https://www.getpostman.com/collections/4a7c7e33aa5dc9dd11b1',
            sdkOptions, {}, (err, snippet) => {
                expect(err).to.be.null;
                expect(snippet).to.include('request = require(\'request\')');
            });
    });

    it('should generate sdk snippet with source as file path', () => {
        sdkgen.generate('/home/wolf/development/codegen/postman-collection-code-generators/test/fixtures/Postman Echo.postman_collection.json', {}, {}, (err, snippet) => {
            expect(err).to.be.null;
            expect(snippet).to.include('request = require(\'request\')');
        });
    });

    it('should throw an error if invalid colleciton source is provided', () => {
        sdkgen.generate('random letters', sdkOptions, {}, (err, snippet) => {
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
        sdkgen.generate(postmanEchoCollection, sdkOptions, options, (err, snippet) => {
            expect(err).to.be.null;
            expect(snippet).to.include('\t\t');
        });
    });
});
