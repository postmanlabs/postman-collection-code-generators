var exec = require('shelljs').exec,
    fs = require('fs'),
    chalk = require('chalk'),
    codegens,
    path = require('path'),
    getSubfolders = (folder) => {
        return fs.readdirSync(folder)
            .map((subfolder) => { return subfolder; });
    };
const args = process.argv,
    BOILERPLATE = path.resolve(__dirname, '../npm/boilerplate'),
    SDKGEN_FOLDER = path.resolve(__dirname, '../sdkgen') + '/';

sdkgens = getSubfolders(SDKGEN_FOLDER);

if (!args[2]) {
    console.log(chalk.red('Please provide a name for the sdkgen.'));
    return;
}

if (sdkgens.includes(args[2])) {
    console.log(chalk.red('SDKGEN with same name already exists. ' +
        'Please follow the naming convention(language-library(variant)) and choose a unique name.\n'));
    return;
}

exec('cp -a ' + BOILERPLATE + '/. ' + SDKGEN_FOLDER + args[2] + '/');

console.log(chalk.yellow('A folder named ' + args[2] +
  ' has been added to /sdkgen. This folder contains the basic structure of a sdk-generator.\n'));
