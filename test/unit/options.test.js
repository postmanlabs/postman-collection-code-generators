/* eslint-disable max-len */
const expect = require('chai').expect,
  assert = require('chai').assert,
  sdkGenerator = require('../../'),
  utils = require('../../lib/utils'),
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
    sdkGenerator.getSDKOptions((err, options) => {
      if (err) {
        expect(err).to.be.null;
      }
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
  });

  it('should return global sdk options if language and variants are not provided', () => {
    sdkGenerator.getSDKOptions((err, options) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(options.length).to.equals(sdkOptions.length);
    });
  });

  it('should return options for given language with global options', () => {
    sdkGenerator.getSDKOptions('Nodejs', 'Request', (err, options) => {
      if (err) {
        expect(err).to.be.null;
      }
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
  });

  it('should have same type for default and option type', () => {
    sdkGenerator.getSDKOptions((err, options) => {
      if (err) {
        expect(err).to.be.null;
      }
      options.forEach((option) => {
        expect(typeof option.default).to.equals(option.type.toLowerCase());
      });
    });
  });

  it('should throw an error if invalid language and variant are provided', () => {
    sdkGenerator.getSDKOptions('wronglang', 'wrongvariant', (err) => {
      if (err) {
        expect(err);
      }
    });
  });

});

describe('Sanitize option method: ', () => {

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
