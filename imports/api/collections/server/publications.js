/* eslint prefer-arrow-callback: 0 */
/* eslint meteor/audit-argument-checks: 0 */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Collections } from '../collection.js';

Meteor.publish('Collections.all', function all() {
  return Collections.find();
});

Meteor.publish('Collections.own', function ownCollections() {
  return Collections.find({
    uid: this.userId,
  });
});

Meteor.publish('Collections.inUser', function targetUserCollections(user) {
  new SimpleSchema({
    user: { type: String, label: '用户名', max: 10 },
  }).validator({ clean: true, filter: false });
  return Collections.find({
    user,
  });
});

Meteor.publish('Collections.colNames', function colNames() {
  return Collections.find({
    uid: this.userId,
  }, {
    fields: { name: 1 },
  });
});
