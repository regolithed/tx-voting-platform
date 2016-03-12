const ModelMocker = require('./model-mocker');

// Iterates over the provided collection schema and converts it into
// model mocker objects
const getCollections = (collectionSchema) => {
  const collections = {};
  Object.keys(collectionSchema).forEach(name => {
    collections[name] = new ModelMocker(collectionSchema[name]);
  });
  return collections;
};

// provides a basic interface so that the user can call
// dbMocker(collection).read etc
const DbMocker = (collectionSchema) => {
  const collections = getCollections(collectionSchema);
  const db = (collection) => {
    if (collections[collection] === undefined) {
      throw new Error(`${collection} collection doesnt exist`);
    }
    return collections[collection];
  };
  db.emptyAll = () => {
    const emptyPromises = Object.keys(collections)
      .map(collection => collections[collection].delete());
    return Promise.all(emptyPromises);
  };
  return db;
};


module.exports = DbMocker;
