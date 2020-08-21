/* eslint-disable max-len */
const expect = require('chai').expect,
  assert = require('chai').assert,
  sdkGenerator = require('../../'),
  utils = require('../../lib/utils'),
  sdk = require('postman-collection'),
  sdkgens = require('../../lib/assets/sdkgens'),
  sdkOptions = require('../../lib/assets/sdkOptions');

describe('List Available SDK', () => {
  it('should return list of available sdk', () => {
    let available = sdkGenerator.getLanguageList();
    available.forEach((sdkgen) => {
      expect(sdkgen).to.haveOwnProperty('name');
      expect(sdkgen).to.haveOwnProperty('language');
      expect(sdkgen).to.haveOwnProperty('variant');
    });
  });
});

describe('SDK Generator options', () => {
  it('options should contain all required properties', () => {
    let options = sdkGenerator.getSDKOptions();
    options.forEach((option) => {
      expect(option).to.have.haveOwnProperty('name');
      expect(option).to.have.haveOwnProperty('id');
      expect(option).to.have.haveOwnProperty('default');
      expect(option).to.have.haveOwnProperty('availableOptions');
      expect(option).to.have.haveOwnProperty('type');
      expect(option).to.have.haveOwnProperty('required');
      expect(option).to.have.haveOwnProperty('description');
    });
  });

  it('should return global sdk options if language and variants are not provided', () => {
    let options = sdkGenerator.getSDKOptions();
    expect(options.length).to.equals(sdkOptions.length);
  });

  it('should return options for given language with global options', () => {
    let options = sdkGenerator.getSDKOptions('Nodejs', 'Request');
    assert(options.length >= sdkOptions.length);
  });

  it('should add default options to option array if not provided', () => {
    expect(true);
    let options = {
      language: 'Nodejs',
      variant: 'Request'
    };
    utils.sanitizeOptions(options, sdkOptions);
    expect(options.language).to.equals('Nodejs');
    expect(options.variant).to.equals('Request');
    expect(options.outputType).to.equals('String');
    expect(options.outputFilePath).to.equals(require.main.path);
    expect(options.includeReadme).to.equals(false);
    expect(options.variables).to.deep.equals({});
  });

  it('should not add default options to option array if option is provided', () => {
    expect(true);
    let testVariables = {
        a: 1,
        b: 2
      },
      options = {
        language: 'Nodejs',
        variant: 'Request',
        outputType: 'File',
        outputFilePath: __dirname,
        includeReadme: false,
        variables: testVariables
      };
    utils.sanitizeOptions(options, sdkOptions);
    expect(options.language).to.equals('Nodejs');
    expect(options.variant).to.equals('Request');
    expect(options.outputType).to.equals('File');
    expect(options.outputFilePath).to.equals(__dirname);
    expect(options.includeReadme).to.equals(false);
    expect(options.variables).deep.equals(testVariables);
  });
});