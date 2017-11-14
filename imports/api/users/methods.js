import map from 'lodash/map';
import includes from 'lodash/includes';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Users } from './user';

/**
 * Validator Options
 * Clean: Intended to be called prior to validation to avoid any avoidable validation errors.
 * Filter: Filter out properties not found in the schema? True by default.
 */
export const updateProfile = new ValidatedMethod({
  name: 'users.updateProfile',
  mixins: [CallPromiseMixin],
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
    newProfile = Object.assign({}, User.profile, newProfile);
    return Users.update(this.userId, { $set: { profile: newProfile } });
  },
});

export const followUser = new ValidatedMethod({
  name: 'users.followUser',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    targetId: { type: String, label: '被关注者Id', regEx: SimpleSchema.RegEx.Id },
    targetName: { type: String, label: '被关注者用户名', max: 20 },
  }).validator({ clean: true, filter: false }),
  run({ targetId, targetName }) {
    if (!this.userId) {
      throw new Meteor.Error('api.users.followUser.notLoggedIn');
    }
    // can not manipulate own profile.followers field
    if (this.userId === targetId) {
      throw new Meteor.Error('api.users.followUser.targetDenied');
    }
    const followerName = Users.findOne(this.userId).username;
    Users.update(targetId, { $addToSet: { 'profile.followers': followerName } });
    Users.update(this.userId, { $addToSet: { 'profile.following': targetName } });
  },
});

export const unFollowUser = new ValidatedMethod({
  name: 'users.unFollowUser',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    targetId: { type: String, label: '被取消关注者Id', regEx: SimpleSchema.RegEx.Id },
    targetName: { type: String, label: '被关注者用户名', max: 20 },
  }).validator({ clean: true, filter: false }),
  run({ targetId, targetName }) {
    if (!this.userId) {
      throw new Meteor.Error('api.users.unFollowUser.notLoggedIn');
    }
    // can not manipulate own profile.followers field
    if (this.userId === targetId) {
      throw new Meteor.Error('api.users.unFollowUser.targetDenied');
    }
    const unfollowerName = Users.findOne(this.userId).username;
    Users.update(targetId, { $pull: { 'profile.followers': unfollowerName } });
    Users.update(this.userId, { $pull: { 'profile.following': targetName } });
  },
});

// Get list of all method names on Users
const USERS_METHODS = map([
  updateProfile,
  followUser,
  unFollowUser,
], 'name');

if (Meteor.isServer) {
  // Only allow 2 user operations per connection per 5 second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(USERS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
