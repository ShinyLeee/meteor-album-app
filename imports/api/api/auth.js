import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Collections } from '/imports/api/collections/collection.js';

if (Meteor.isServer) {
  Meteor.methods({
    'Auth.isLogin': function isLogin() {
      const response = !!this.userId;
      return response;
    },

    'Auth.isAdmin': function isAdmin() {
      const response = !!Meteor.user().isAdmin;
      return response;
    },

    'Auth.isOwner': function isOwner({ username }) {
      new SimpleSchema({
        username: { type: String, label: '用户名', max: 20 },
      }).validator({ clean: true, filter: false });
      if (!this.userId) {
        return false;
      }
      const uid = Meteor.users.findOne({ username })._id;
      return this.userId === uid;
    },

    'Auth.isAllowVisitHome': function isAllowVisitHome({ username }) {
      new SimpleSchema({
        username: { type: String, label: '用户名', max: 20 },
      }).validator({ clean: true, filter: false });
      const targetUser = Meteor.users.findOne({ username });
      if (!targetUser) {
        throw new Meteor.Error(404, '该用户不存在');
      }
      // 如果是访问自己的主页，直接返回true
      if (targetUser._id === this.userId) {
        return true;
      }
      const response = targetUser.profile.settings.allowVisitHome;
      return response;
    },

    'Auth.isAllowVisitColl': function isAllowVisitColl({ username, cname }) {
      new SimpleSchema({
        username: { type: String, label: '用户名', max: 20 },
        cname: { type: String, label: '相册名', max: 20, optional: true },
      }).validator({ clean: true, filter: false });
      const targetUser = Meteor.users.findOne({ username });
      if (!targetUser) {
        throw new Meteor.Error(404, '该用户不存在');
      }
      // 如果是自己的相册页面 直接返回true
      if (targetUser._id === this.userId) {
        return true;
      }

      const isUserAllowVisitColl = targetUser.profile.settings.allowVisitColl;
      // 如果cname参数不存在，则访问的是全部相册页面
      // 直接返回目标用户是否允许访问相册
      if (!cname) {
        return isUserAllowVisitColl;
      }

      const targetColl = Collections.findOne({ name: cname });
      if (!targetColl) {
        throw new Meteor.Error(404, '该相册不存在');
      }
      const isCollPublic = !targetColl.private;
      return isUserAllowVisitColl && isCollPublic;
    },

  });

  const AUTH_METHODS = [
    'Auth.isLogin',
    'Auth.isAdmin',
    'Auth.isPermission',
    'Auth.isAllowVisitHome',
    'Auth.isAllowVisitColl',
  ];

  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(AUTH_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
