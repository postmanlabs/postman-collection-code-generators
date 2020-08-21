const expect = require('chai').expect,
  sdk = require('postman-collection'),
  sdkgen = require('../../'),
  collection = require('../../../../test/fixtures/SDKGEN.postman_collection.json'),
  COLLECTION_INSTANCE = new sdk.Collection(collection);

describe('SDkgen options:', () => {
  it('should return list of possible options', () => {
    let options = sdkgen.getOptions();
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

  it('should have same type for default and option type', () => {
    let options = sdkgen.getOptions();
    options.forEach((option) => {
      expect(typeof option.default).to.equals(option.type.toLowerCase());
    });
  });
});

describe('Response Return Method:', () => {
  it('should include snippet to return promise if return type is promise', async () => {
    await sdkgen.generate(COLLECTION_INSTANCE, {
      returnMethod: 'Promise'
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('return new Promise');
      expect(snippet).to.include('return reject(error);');
      expect(snippet).to.include('return resolve(response);');
    });
  });

  it('should not include callback as param if return type is promise', async () => {
    await sdkgen.generate(COLLECTION_INSTANCE, {
      returnMethod: 'Promise'
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.not.include('(variables, callback)');
    });
  });

  it('should not include callback as param (in docs) if return type is promise', async () => {
    await sdkgen.generate(COLLECTION_INSTANCE, {
      returnMethod: 'Promise'
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.not.include('@param {Function} callback');
    });
  });

  it('should include snippet to call callback if return type is callback', async () => {
    await sdkgen.generate(COLLECTION_INSTANCE, {
      returnMethod: 'Callback'
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('(variables, callback)');
      expect(snippet).to.include('return callback(error, response);');
    });
  });

  it('should include callback as param (in docs) if return type is promise', async () => {
    await sdkgen.generate(COLLECTION_INSTANCE, {
      returnMethod: 'Callback'
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.include('@param {Function} callback');
    });
  });

  it('should not include snippet to return promise if return type is callback', async () => {
    await sdkgen.generate(COLLECTION_INSTANCE, {
      returnMethod: 'Callback'
    }, (err, snippet) => {
      if (err) {
        expect(err).to.be.null;
      }
      expect(snippet).to.not.include('return new Promise');
      expect(snippet).to.not.include('return reject(error);');
      expect(snippet).to.not.include('return resolve(response);');
    });
  });
});
