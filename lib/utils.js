const sdk = require('postman-collection');
const { itemHandler, itemGroupHandler } = require('../sdkgen/nodejs-request/lib/util');

/**
 * Function to travel postman collection.
 * Uses DFS algorithm so as to maintain folder structure.
 *
 * Accepts two handler/helper methods which can differ for each language
 *  ie; ItemHandler & Itemgroup handler
 *
 * @param collectionItem - CollectionItemMember instance
 * @param options - postman-code-generator options
 * @param ItemHandler - Method which handles Collectionitem if its a {Item}
 * @param ItemGroupHandler - Method which handles Collection Item if its a {ItemGoup}
 */
function processCollection (collectionItem, options, ItemHandler, ItemGroupHandler) {
  if (sdk.Item.isItem(collectionItem)) {
    return new Promise(async (resolve, reject) => {
      try {
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

    groupPromises = collectionItem.items.members.map((element) => {
      return processCollection(element, options, itemHandler, ItemGroupHandler)
        .then((snippet) => {
          groupResult.push(snippet);
        })
        .catch((error) => {
          return reject(error);
        });
    });
    await Promise.all(groupPromises);
    return resolve(ItemGroupHandler(collectionItem, groupResult));
  });
}

module.exports = {
  processCollection
};

