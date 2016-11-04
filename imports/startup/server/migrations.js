import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Migrations } from 'meteor/percolate:migrations';

import { Images } from '/imports/api/images/image.js';
import { Collections } from '/imports/api/collections/collection.js';

Migrations.config({
  // Log job run details to console
  log: true,

  // Use a custom logger function (defaults to Meteor's logging package)
  logger: null,

  // Enable/disable logging "Not migrating, already at version {number}"
  logIfLatest: true,

  // Migrations collection name to use in the database
  collectionName: 'migrations',
});


// VERSION 1
// Add Collection collection according to Image collection's collection field

Migrations.add({
  version: 1,
  up() {
    // This is how to get access to the raw MongoDB node
    // collection that the Meteor server collection wraps
    const batch = Collections.rawCollection().initializeUnorderedBulkOp();

    // Mongo throws an error if we execute a batch operation without actual operations,
    // e.g. when Images was empty.
    let newCols = [];
    let hasUpdates = false;

    Images.find().forEach((image) => {
      newCols.push({ uid: image.uid, name: image.collection });
    });

    newCols = _.sortBy(newCols, 'uid');
    for (let i = 0; i < newCols.length - 1; i++) {
      if (_.isEqual(newCols[i], newCols[i + 1])) {
        delete newCols[i];
      }
    }
    _.each(newCols, (newCol) => {
      batch.insert(newCol);
      hasUpdates = true;
    });


    if (hasUpdates) {
      // We need to wrap the async function to get a synchronous API that migrations expects
      const execute = Meteor.wrapAsync(batch.execute, batch);
      return execute();
    }

    return true;
  },
  down() {
    Collections.rawCollection().drop();
  },
});
