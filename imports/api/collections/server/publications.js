/* eslint prefer-arrow-callback: 0 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Collections } from '../collection.js';

Meteor.publish('Collections.all', function all() {
  return Collections.find();
});

Meteor.publish('Collections.own', function ownCollections() {
  return Collections.find({
    uid: this.userId,
  });
});

Meteor.publish('Collections.targetUser', function targetUserCollections(user) {
  check(user, String);
  return Collections.find({
    user,
    private: false,
  });
});

Meteor.publish('Collections.colNames', function colNames() {
  return Collections.find({
    uid: this.userId,
  }, {
    fields: { name: 1 },
  });
});
