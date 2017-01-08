import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { Users } from '/imports/api/users/user';
import { Notes } from '/imports/api/notes/note';
import { Images } from '/imports/api/images/image';
import { Collections } from '/imports/api/collections/collection';

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
  name: `Refactoring IMAGES & COLLECTIONS & NOTES collection,
  unset uid field in IMAGES & COLLECTIONS collection,
  change sender and receiver field's value from uid to username.
  `,
  up: () => {
    // Get access to the raw MongoDB node collection that the Meteor server collection wraps
    const notesBulk = Notes.rawCollection().initializeUnorderedBulkOp();
    const imagesBulk = Images.rawCollection().initializeUnorderedBulkOp();
    const collectionsBulk = Collections.rawCollection().initializeUnorderedBulkOp();

    // Unset all uid field in Collections & Images collection
    imagesBulk.find({}).update({ $unset: { uid: 1 } });
    collectionsBulk.find({}).update({ $unset: { uid: 1 } });

    // Change all sender and receiver fields' value from uid to username
    Users.find().forEach((user) => {
      const uid = user._id;
      const username = user.username;
      notesBulk.find({ sender: uid }).update({ $set: { sender: username } });
      notesBulk.find({ receiver: uid }).update({ $set: { receiver: username } });
    });

    // We need to wrap the async function to get a synchronous API that migrations expects
    const executeNotes = Meteor.wrapAsync(notesBulk.execute, notesBulk);
    const executeImages = Meteor.wrapAsync(imagesBulk.execute, imagesBulk);
    const executeCollections = Meteor.wrapAsync(collectionsBulk.execute, collectionsBulk);

    executeNotes();
    executeImages();
    executeCollections();
  },
  down: () => {
    const notesBulk = Notes.rawCollection().initializeUnorderedBulkOp();
    const imagesBulk = Images.rawCollection().initializeUnorderedBulkOp();
    const collectionsBulk = Collections.rawCollection().initializeUnorderedBulkOp();

    Users.find().forEach((user) => {
      const uid = user._id;
      const username = user.username;
      notesBulk.find({ sender: username }).update({ $set: { sender: uid } });
      notesBulk.find({ receiver: username }).update({ $set: { receiver: uid } });
      imagesBulk.find({ user: username }).update({ $set: { uid } });
      collectionsBulk.find({ user: username }).update({ $set: { uid } });
    });

    const executeNotes = Meteor.wrapAsync(notesBulk.execute, notesBulk);
    const executeImages = Meteor.wrapAsync(imagesBulk.execute, imagesBulk);
    const executeCollections = Meteor.wrapAsync(collectionsBulk.execute, collectionsBulk);

    executeNotes();
    executeImages();
    executeCollections();
  },
});
