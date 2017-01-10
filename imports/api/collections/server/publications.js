/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Collections } from '../collection.js';

Meteor.publish('Collections.all', function all() {
  return Collections.find({});
});

Meteor.publish('Collections.own', function ownCollections() {
  const user = Meteor.users.findOne(this.userId).username;
  return Collections.find({ user });
});

Meteor.publish('Collections.inUser', function targetUserCollections(user) {
  new SimpleSchema({
    user: { type: String, label: '用户名', max: 10 },
  }).validator({ clean: true, filter: false });
  return Collections.find({
    user,
  });
});

Meteor.publish('Collections.collNames', function collNames() {
  const user = Meteor.users.findOne(this.userId).username;
  return Collections.find(
    { user },
    { fields: { name: 1 } }
  );
});
