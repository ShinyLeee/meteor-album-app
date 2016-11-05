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
    const newCols = [];

    Images.find({}, {
      sort: [['uid', 'asc'], ['collection', 'asc']],
    }).forEach((image) => {
      newCols.push({
        uid: image.uid,
        name: image.collection,
        quantity: 1,
      });
    });

    for (let i = 0; i < newCols.length - 1; i++) {
      if (newCols[i].uid === newCols[i + 1].uid && newCols[i].name === newCols[i + 1].name) {
        newCols[i + 1].quantity = newCols[i].quantity + 1;
        newCols.splice(i, 1);
        i--;
      }
    }
    _.each(newCols, (newCol) => {
      Collections.insert(newCol);
    });
  },
  down() {
    Collections.rawCollection().drop();
  },
});
