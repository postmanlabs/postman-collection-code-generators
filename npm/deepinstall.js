var shell = require('shelljs'),
  path = require('path'),
  async = require('async'),
  pwd = shell.pwd(),
  PATH_TO_ASSETS = path.resolve(path.join(__dirname, '../lib/assets')),
  PATH_TO_PACKAGE_SCRIPT = path.join(__dirname, 'package.js');

async.series([
  function (next) {
    console.log('Running package Script');
    let output = shell.exec('node ' + PATH_TO_PACKAGE_SCRIPT);

    if (output.code !== 0) {
      console.error('Filed while running package script.');
      return next(output.stderr);
    }

    console.log('Run successful sdkgens.js saved in lib/assets');
    return next();
  },
  function (next) {
    let sdkgens = require(PATH_TO_ASSETS + '/sdkgens.js');
    sdkgens.forEach((sdkgen) => {
      let PATH_TO_SDKGEN = path.join(PATH_TO_ASSETS, sdkgen.path),
        output;
      shell.cd(PATH_TO_SDKGEN);

      console.log(`${sdkgen.name}: npm install`);
      output = shell.exec('npm install');

      shell.cd(pwd);

      if (output.code !== 0) {
        console.error('Filed to run npm install for sdkgen: ' + sdkgen.name);
        return next(output.stderr);
      }

      console.log('Successfull install for sdkgen: ' + sdkgen.name);
      return next();
    });
  }
], (err) => {
  if (err) {
    console.log(err);
  }
  shell.cd(pwd);
});
