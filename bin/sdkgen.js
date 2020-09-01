#!/usr/bin/env node

const _ = require('lodash'),
  Command = require('commander').Command,
  program = new Command(),
  chalk = require('chalk'),
  Table = require('cli-table3'),
  async = require('async'),
  generator = require('..'),
  {
    combineVariables,
    argsToVariableList,
    fetchJSON,
    additionalOptionToJson,
    resolvePath
  } = require('./utils'),
  version = require('../package.json').version;

/**
 * Method to run when generate command is called
 *
 * @param {string} collection - Collection source
 * @param {object} command - commander object
 */
function runGenerate (collection, command) {
  async.waterfall([
    (next) => {
      // resolving collection source
      if (command.verbose) { console.log(chalk.green.bold('Resolving Collection...')); }
      fetchJSON(collection, (err, json) => {
        if (err) {
          return next(err);
        }
        next(null, { collection: json });
      });
    },
    // adding collection variable if mentioned
    (data, next) => {
      if (command.collectionVariables) {
        if (command.verbose) { console.log(chalk.green.bold('Resolving collection variables...')); }
        data.collectionVariables = data.collection.variable || [];
        return next(null, data);
      }
      return next(null, data);
    },
    // resolving environment variables if mentioned
    (data, next) => {
      if (command.environmentVariables) {
        if (command.verbose) { console.log(chalk.green.bold('Resolving environment variables...')); }
        fetchJSON(command.environmentVariables, (err, json) => {
          if (err) {
            return next(err);
          }
          data.environmentVariables = json.values || [];
          next(null, data);
        });
      }
      else {
        return next(null, data);
      }
    },
    // resolving global variables if mentioned
    (data, next) => {
      if (command.globalVariables) {
        if (command.verbose) { console.log(chalk.green.bold('Resolving global variables...')); }
        fetchJSON(command.globalVariables, (err, json) => {
          if (err) {
            return next(err);
          }
          data.globalVariables = json.values || [];
          next(null, data);
        });
      }
      else {
        return next(null, data);
      }
    },
    (data, done) => {
      // passing all the variables to combine variables to get combined object
      let variables = combineVariables(
          data.globalVariables,
          data.collectionVariables,
          data.environmentVariables,
          (command.variable ? argsToVariableList(command.variables) : [])
        ),
        additionalOptions = additionalOptionToJson(command.additional || []);
      if (command.verbose) { console.log(chalk.green.bold('Generating SDK...')); }
      generator.generate({
        type: 'json',
        source: data.collection
      }, {
        language: command.language,
        variant: command.library || command.language,
        outputType: (command.output ? 'File' : 'String'),
        outputFilePath: (command.output ? resolvePath(command.output) : undefined),
        variables: variables,
        ...additionalOptions
      }, (err, result) => {
        if (err) {
          return done(err);
        }
        done(null, result);
      });
    }
  ], (err, done) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(done);
    if (command.verbose) { console.log(chalk.green.bold('SDK generated successfully')); }
  });
}
program
  .name('Postman SDK Generator')
  .addHelpCommand(true)
  .version(version, '-V', '--version');

program
  .command('generate <collection>')
  .description('Generates sdk for input collection for a specified language and variant')
  .usage('<collection> [options]')
  .requiredOption('-L, --language <language>',
    'Collection for to generate sdk')
  .option('-l, --library <library>',
    'language variant/library to be used')
  .option('-o, --output <path>',
    'Path for output sdk')
  .option('--collection-variables',
    'Specifies wether to include collection variables or not')
  .option('--environment-variables <path>',
    'Absolute path to environment variables exported from Postman App')
  .option('--global-variables <path>',
    'Absolute path to global variables exported from Postman App')
  .option('-v, --variables [variables...]',
    'Array of variables for sdkgen. Eg; variable1=value1 variable2=value2 variable3=value3')
  .option('--verbose', 'Toggles verbose outputs')
  .option('-a, --additional [additional...]',
    'Array of Additional options in key=value format.Eg; op1=v1 op2=v2')
  .action((collection, command) => {
    runGenerate(collection, command);
  });

/**
 * Command to get list of available sdkgens
 * Command: list or ls
 * Prints language and variant in tabular form
 */
program
  .command('list')
  .alias('ls')
  .description('lists available sdkgenerators')
  .usage('list/ls')
  .action(() => {
    console.log(chalk.green('\nList of available sdkgens'));
    let sdkgens = generator.getLanguageList(),
      table = new Table({
        head: ['Name', 'Language', 'Variant']
      });

    sdkgens.forEach((sdkgen) => {
      table.push([sdkgen.name, sdkgen.language, sdkgen.variant]);
    });

    console.log(table.toString());
  });

/**
 * Command to get options for a particular sdkgen
 */
program
  .command('options')
  .description('Lists available option for a sdk generator')
  .requiredOption('-L, --language <language>',
    'Language whose options are required (use list/ls command to get list of available sdkgens)')
  .requiredOption('-l, --library <library>',
    'Library for inpur language')
  .action((command) => {
    let language = command.language,
      library = command.library;
    generator.getSDKOptions(language, library, (err, options) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(chalk.green.bold('\nOptions:'));
      options.forEach((option) => {
        console.log(`\n${chalk.blue.bold(option.name)}`);
        console.log(`Id: ${chalk.grey(option.id)}`);
        console.log(`Type: ${chalk.grey(option.type)}`);
        console.log(`Available Options: ${chalk.grey(
          _.isArray(option.availableOptions) ?
            option.availableOptions.join(', ') :
            option.availableOptions)}`);
        console.log(`Default: ${chalk.grey(option.default.toString())}`);
        console.log(`Required: ${chalk.grey(option.required)}`);
        console.log(`Description: ${chalk.grey(option.description)}`);
      });
    });
  });

program.parse(process.argv);
