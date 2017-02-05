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
      intro: intro || '',
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
    targetId: { type: String, label: '被关注者Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ targetId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.users.followUser.notLoggedIn');
    }
    // can not manipulate own profile.followers field
    if (this.userId === targetId) {
      throw new Meteor.Error('api.users.followUser.targetDenied');
    }
    const starter = Users.findOne(this.userId).username;
    Users.update(targetId, { $addToSet: { 'profile.followers': starter } });
  },
});

export const unFollowUser = new ValidatedMethod({
  name: 'users.unFollowUser',
  validate: new SimpleSchema({
    targetId: { type: String, label: '被取消关注者Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ targetId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.users.unFollowUser.notLoggedIn');
    }
    // can not manipulate own profile.followers field
    if (this.userId === targetId) {
      throw new Meteor.Error('api.users.unFollowUser.targetDenied');
    }
    const starter = Users.findOne(this.userId).username;
    Users.update(targetId, { $pull: { 'profile.followers': starter } });
  },
});

// Get list of all method names on Users
const USERS_METHODS = _.pluck([
  updateProfile,
  followUser,
  unFollowUser,
], 'name');

if (Meteor.isServer) {
  // Only allow 2 user operations per connection per 5 second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(USERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
