const fs = require('fs'),
  path = require('path'),
  format = require('js-beautify'),
  PATH_TO_ASSETS = path.resolve(__dirname, '../lib/assets');

let sdkgenList = [],
  sdkgenListSnippet,
  formatedString;

try {
  sdkgenList = fs.readdirSync(path.join(__dirname, '..', 'sdkgen')).map((sdkgen) => {
    let package = require(path.join(__dirname, '..', 'sdkgen', sdkgen, 'package.json')),
      sdkgenDetails = {};
    sdkgenDetails.name = package.name;
    sdkgenDetails.language = package.language;
    sdkgenDetails.variant = package.variant;
    sdkgenDetails.extension = package.extension;
    sdkgenDetails.path = `../../sdkgen/${package.name}`;
    sdkgenDetails.module = `<<<require('../../sdkgen/${package.name}')>>>`;
    return sdkgenDetails;
  });
}
catch (err) {
  console.log('Could not package all the SDK generators:');
  console.log(err);
}

try {
  sdkgenListSnippet = `let sdkgens = ${JSON.stringify(sdkgenList)
    .replace(/"<<</, '')
    .replace(/>>>"/, '')
    .replace(/"/g, '\'')
  };\nmodule.exports = sdkgens;`;
  formatedString = format(sdkgenListSnippet, { indent_size: 2, space_in_empty_paren: true });
  fs.writeFileSync(path.join(PATH_TO_ASSETS, 'sdkgens.js'), formatedString + '\n');
}
catch (error) {
  console.log(error);
}


