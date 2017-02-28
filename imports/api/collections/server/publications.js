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

Meteor.publish('Collections.ownFollowing', function ownFollowingCollections() {
  const own = Meteor.users.findOne(this.userId);
  return Collections.find({
    user: { $in: own.profile.following },
    private: false,
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

Meteor.publish('Collections.inUserFollowing', function targetUserFollowingCollections(user) {
  new SimpleSchema({
    user: { type: String, label: '用户名', max: 10 },
  }).validator({ clean: true, filter: false });
  const userObj = Meteor.users.findOne({ username: user });
  return Collections.find({
    user: { $in: userObj.profile.following },
    private: false,
  });
});

Meteor.publish('Collections.limit', function limit(num) {
  new SimpleSchema({
    num: { type: Number, label: '限制数量' },
  }).validator({ clean: true, filter: false });
  return Collections.find(
    { private: false },
    { limit: num });
});
