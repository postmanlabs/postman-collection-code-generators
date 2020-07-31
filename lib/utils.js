const sdk = require('postman-collection');
const { itemHandler, itemGroupHandler } = require('../sdkgen/nodejs-request/lib/util');

/**
 * Function to travel postman collection.
 * Uses DFS algorithm so as to maintain folder structure.
 *
 * Accepts two handler/helper methods which can differ for each language
 *  ie; ItemHandler & Itemgroup handler
 *
 * @param {sdk.Collection} collectionItem - CollectionItemMember instance
 * @param {object} options - postman-code-generator options
 * @param {function} ItemHandler - Method which handles Collectionitem if its a {Item}
 * @param {function} ItemGroupHandler - Method which handles Collection Item if its a {ItemGoup}
 */
function processCollection (collectionItem, options, ItemHandler, ItemGroupHandler) {
  if (sdk.Item.isItem(collectionItem)) {
    return new Promise(async (resolve, reject) => {
      try {
        // generates snippet for a pm.Item as per required
        let itemSnippet = await itemHandler(collectionItem, options);
        return resolve(itemSnippet);
      }
      catch (error) {
        return reject(error);
      }
    });
  }
  return new Promise(async (resolve, reject) => {
    let groupResult = [],
      groupPromises;

    // Mapping all the collection item members to processCollection promise
    // The promise appends the result to groupResult array which is further passed to itemHandler
    // method to generate snippet for a pm.ItemGroup
    groupPromises = collectionItem.items.members.map((element) => {
      return processCollection(element, options, itemHandler, ItemGroupHandler)
        .then((snippet) => {
          groupResult.push(snippet);
        })
        .catch((error) => {
          return reject(error);
        });
    });
    // resolving all promisses to get sequence correct
    await Promise.all(groupPromises);
    // returning result via ItemGroupHandler
    return resolve(ItemGroupHandler(collectionItem, groupResult));
  });
}

module.exports = {
  processCollection
};

