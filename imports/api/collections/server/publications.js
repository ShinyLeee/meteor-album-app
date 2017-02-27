/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Collections } from '../collection.js';

Meteor.publish('Collections.all', function all() {
  return Collections.find({
    private: false,
  });
});

Meteor.publish('Collections.own', function ownCollections() {
  const own = Meteor.users.findOne(this.userId);
  return Collections.find({
    user: own.username,
  });
});

Meteor.publish('Collections.inUser', function targetUserCollections(user) {
  new SimpleSchema({
    user: { type: String, label: '用户名', max: 10 },
  }).validator({ clean: true, filter: false });
  return Collections.find({
    user,
    private: false,
  });
});

Meteor.publish('Collections.ownFollowed', function ownFollowedCollections() {
  const own = Meteor.users.findOne(this.userId);
  return Collections.find({
    user: { $in: [...own.profile.following, own.username] },
  });
});

Meteor.publish('Collections.inUserFollowed', function targetUserFollowedCollections(user) {
  new SimpleSchema({
    user: { type: String, label: '用户名', max: 10 },
  }).validator({ clean: true, filter: false });
  const userObj = Meteor.users.findOne({ user });
  return Collections.find({
    user: { $in: [...userObj.profile.following, user] },
    private: false,
  });
});

Meteor.publish('Collections.collNames', function collNames() {
  const user = Meteor.users.findOne(this.userId);
  return Collections.find(
    { user: user && user.username },
    { fields: { name: 1 } }
  );
});

Meteor.publish('Collections.limit', function limit(num) {
  new SimpleSchema({
    num: { type: Number, label: '限制数量' },
  }).validator({ clean: true, filter: false });
  return Collections.find(
    { private: false },
    { limit: num });
});
