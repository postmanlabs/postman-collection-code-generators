/**
 * List of errors used in entire project
 */
module.exports = {
  'INVALID_COLLECTION_SOURCE': new Error('Invalid collection source. Collection source is either broken or missing'),
  'INVALID_URL': new Error('Invalid url. Insert a proper url which returns json on get request.'),
  'UNABLE_TO_WRITE_FILE': new Error('Unable to write output to the file.'),
  'INVALID_LANGUAGE': new Error('SDK generator for this language does not exist.' +
    'Check getLanguageList to get list of available languages'),
  'INVALID_VAIRIANT': new Error('SDK generator for this language variant does not exist' +
    'Check getLanguageList method to get list of available sdk generators'),
  'INVALID_PARAMETER': new Error('Invalid parameter. Check docs and provide correct parameters'),
  'FILE_PATH_NOT_PROVIDED': new Error('File path not provided. The outpuFilePath' +
    'option is required if outputType is set to File'),
  'INVALID_VARIABLE': new Error('Invalid or broken variables'),
  'INVALID_SDKGEN_OPTION_VALUE': (optionName, value) => {
    return new Error(`"${value}" is not a valid value for option ${optionName}`);
  },
  'INVALUDE_SDKGEN_OPTION_TYPE': (optionsName, type) => {
    return new Error(`"${optionsName}" option requires value of type ${type}`);
  },
  'UNKNOWN_SDKGEN': (language, variant) => {
    return new Error(`SDK generator for ${language} - ${variant}  variant not found.
    Get list of available sdkgens from listSdkGens() method`);
  },
  'MISSING_OPTION': (optionName) => {
    return new Error(`${optionName} is a required option.`);
  }
};
