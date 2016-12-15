import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Users } from './user.js';

/**
 * Validator Options
 * Clean: Intended to be called prior to validation to avoid any avoidable validation errors.
 * Filter: Filter out properties not found in the schema? True by default.
 */
export const updateUser = new ValidatedMethod({
  name: 'users.update',
  validate: new SimpleSchema({
    nickname: { type: String, label: '昵称', max: 10, optional: true },
    intro: { type: String, label: '个人简介', max: 20, optional: true },
    cover: { type: String, optional: true },
    avatar: { type: String, optional: true },
    relater: { type: [String], optional: true },
    settings: { type: Object, optional: true, blackbox: true },
  }).validator({ clean: true, filter: false }),
  run({ nickname, intro, cover, avatar, settings }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    const User = Meteor.users.findOne(this.userId);
    let newProfile = {
      nickname,
      intro,
      cover,
      avatar,
      settings,
    };
    newProfile = _.extend(User.profile, newProfile);
    return Users.update(this.userId, { $set: { profile: newProfile } });
  },
});

export const followUser = new ValidatedMethod({
  name: 'users.follow',
  validate: new SimpleSchema({
    follower: { type: String, label: '关注者', regEx: SimpleSchema.RegEx.Id },
    target: { type: String, label: '被关注者', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ follower, target }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Users.update(target, { $addToSet: { 'profile.followers': follower } });
  },
});

export const unFollowUser = new ValidatedMethod({
  name: 'users.unFollow',
  validate: new SimpleSchema({
    unFollower: { type: String, label: '取消关注者', regEx: SimpleSchema.RegEx.Id },
    target: { type: String, label: '被取消关注者', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ unFollower, target }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Users.update(target, { $pull: { 'profile.followers': unFollower } });
  },
});

// Get list of all method names on Users
const USERS_METHODS = _.pluck([
  updateUser,
  followUser,
  unFollowUser,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(USERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 1000);
}
