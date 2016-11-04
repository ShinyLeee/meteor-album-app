/* eslint prefer-arrow-callback: 0 */
import { Meteor } from 'meteor/meteor';
import { Collections } from '../collection.js';

Meteor.publish('Collections.all', function all() {
  return Collections.find();
});

Meteor.publish('Collections.own', function ownCollections() {
  return Collections.find({
    uid: this.userId,
  });
});
