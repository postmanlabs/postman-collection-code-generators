let options = [{
  name: 'SDK output type',
  id: 'outputType',
  availableOptions: ['File', 'String'],
  type: 'String',
  default: 'String',
  required: false,
  description: 'Specifies Type of Output for the generated SDK'
},
{
  name: 'SDK output file name',
  id: 'outputFilePath',
  availableOptions: null,
  type: 'String',
  default: require.main.path,
  required: false,
  description: 'Specifies output path for generated SDK'
},
{
  name: 'SDK Language',
  id: 'language',
  availableOptions: 'Use getLanguageList method to get list of available sdkgens',
  type: 'String',
  default: '',
  required: true,
  description: 'Language of the generated SDK'
},
{
  name: 'SDK language variant',
  id: 'variant',
  availableOptions: 'Use getLanguageList method to get list of available sdkgens and variants',
  default: '',
  type: 'String',
  required: true,
  description: 'Library to be used in generated SDK'
},
{
  name: 'SDK Variables',
  id: 'variables',
  availableOptions: 'any',
  default: {},
  type: 'Object',
  required: false,
  description: 'Object of variables to be included and declared in generated sdk'
}
];

module.exports = options;
