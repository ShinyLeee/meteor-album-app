import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { Collections } from '/imports/api/collections/collection';
import { Images } from '/imports/api/images/image';
import { Users } from '/imports/api/users/user';

// Use rawCollection in order to avoid break schema
const rawImages = Images.rawCollection();
const rawCollections = Collections.rawCollection();

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

Migrations.add({
  version: 1,
  name: 'Refactoring IMAGE collection and COLLECTIONS collection, make user field as userId, etc..',
  up: () => {
    // Remove all uid field in Images 表
    Meteor.wrapAsync(rawImages.update(
      {},
      { $unset: { uid: 1 } },
      { multi: true }
    ));
    // Remove all uid field in Collections 表
    Meteor.wrapAsync(rawCollections.update(
      {},
      { $unset: { uid: 1 } },
      { multi: true }
    ));
    // Update all collection field from cname to cid in Images 表
    // accroding to current collection name
    Collections.find().forEach((coll) => {
      const cid = coll._id;
      const cname = coll.name;
      Meteor.wrapAsync(rawImages.update(
        { collection: cname },
        { $set: { collection: cid } },
        { multi: true }
      ));
    });
  },
  down: () => {
    // Recovery Images and Collections' uid field accroding to User's id
    Users.find().forEach((user) => {
      const uid = user._id;
      const username = user.username;
      Meteor.wrapAsync(rawImages.update(
        { user: username },
        { $set: { uid } },
        { multi: true }
      ));
      Meteor.wrapAsync(rawCollections.update(
        { user: username },
        { $set: { uid } },
        { multi: true }
      ));
    });
    Collections.find().forEach((coll) => {
      const cid = coll._id;
      const cname = coll.name;
      Meteor.wrapAsync(rawImages.update(
        { collection: cid },
        { $set: { collection: cname } },
        { multi: true }
      ));
    });
  },
});
