let path = require('path'),
  options = [{
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
    id: 'outputFile',
    availableOptions: null,
    type: 'String',
    default: path.join(require.main.path, './sdk.js'),
    required: false,
    description: 'Specifies output path for generated SDK'
  },
  {
    name: 'SDK Language',
    id: 'language',
    availableOptions: 'Use listSdkgen method to get list of available sdkgens',
    type: 'String',
    default: null,
    required: true,
    description: 'Specifies Language for SDK generation'
  },
  {
    name: 'SDK language variant',
    id: 'variant',
    availableOptions: 'any',
    default: null,
    type: 'String',
    required: true,
    description: 'Specifies Language variant for SDK generation'
  },
  {
    name: 'Includes README with the package if output type is file',
    id: 'includeReadme',
    availableOptions: 'any',
    type: Boolean,
    default: false,
    required: false,
    description: 'Specifies to add or not to add README along with sdk'
  },
  {
    name: 'SDK Variables',
    id: 'variables',
    default: {},
    availableOptions: 'any',
    type: Object,
    required: false,
    description: 'Object of variables to be included and declared in generated sdk'
  }
  ];

module.exports = options;
