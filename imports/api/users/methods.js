import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Users } from './user.js';

export const createUser = new ValidatedMethod({
  name: 'users.createUser',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    username: { type: String, label: '用户名', max: 20 },
    password: { type: String },
  }).validator({ clean: true, filter: false }),
  run({ username, password }) {
    if (this.userId) {
      throw new Meteor.Error('api.users.createUser.hasLoggedIn');
    }
    Accounts.createUser({ username, password });
  },
});
/**
 * Validator Options
 * Clean: Intended to be called prior to validation to avoid any avoidable validation errors.
 * Filter: Filter out properties not found in the schema? True by default.
 */
export const updateProfile = new ValidatedMethod({
  name: 'users.updateProfile',
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
      throw new Meteor.Error('api.users.updateProfile.notLoggedIn');
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
  name: 'users.followUser',
  validate: new SimpleSchema({
    target: { type: String, label: '被关注者', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ target }) {
    if (!this.userId) {
      throw new Meteor.Error('api.users.followUser.notLoggedIn');
    }
    if (this.userId === target) {
      throw new Meteor.Error('api.users.followUser.targetDenied');
    }
    return Users.update(target, { $addToSet: { 'profile.followers': this.userId } });
  },
});

export const unFollowUser = new ValidatedMethod({
  name: 'users.unFollowUser',
  validate: new SimpleSchema({
    target: { type: String, label: '被取消关注者', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ target }) {
    if (!this.userId) {
      throw new Meteor.Error('api.users.unFollowUser.notLoggedIn');
    }
    if (this.userId === target) {
      throw new Meteor.Error('api.users.unFollowUser.targetDenied');
    }
    return Users.update(target, { $pull: { 'profile.followers': this.userId } });
  },
});

// Get list of all method names on Users
const USERS_METHODS = _.pluck([
  createUser,
  updateProfile,
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
