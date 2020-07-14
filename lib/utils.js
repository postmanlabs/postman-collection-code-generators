const sdk = require('postman-collection');

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
 * @param callback - Callback method to return result
 */
function processCollection (collectionItem, options, ItemHandler, ItemGroupHandler, callback) {
  if (sdk.Item.isItem(collectionItem)) {
    /**
     * Results from itemHandler returned via process collection callback
     */
    ItemHandler(collectionItem, options, (err, snippet) => {
      return callback(err, snippet);
    });
  }
  else {
    var itemGroupResult = [];

    /**
     * Generating results for each member in ItemGroup and storing it in an array
     * Will be passed to ItemGroupHandler to process it as per requirements
     *
     * TODO handle auth at different layers here
     */
    collectionItem.items.members.forEach((element) => {
      processCollection(element, options, ItemHandler, ItemGroupHandler, (err, result) => {
        if (err) {
          return callback(err, null);
        }
        itemGroupResult.push(result);
      });
    });
    ItemGroupHandler(collectionItem, itemGroupResult, options, (err, snippet) => {
      return callback(err, snippet);
    });
  }
}

module.exports = {
  processCollection
};

