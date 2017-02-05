import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

if (Meteor.isServer) {
  Meteor.methods({
    'Accounts.createUser': function createUser({ username, email, password }) {
      new SimpleSchema({
        username: { type: String, label: '用户名', max: 20 },
        email: { type: String, label: '新邮箱地址', regEx: SimpleSchema.RegEx.Email },
        password: { type: String },
      }).validator({ clean: true, filter: false });
      if (this.userId) {
        throw new Meteor.Error('api.accounts.createUser.hasLoggedIn');
      }
      const userId = Accounts.createUser({ username, email, password });
      Accounts.sendVerificationEmail(userId, email);
    },

    'Accounts.sendVerifyEmail': function sendVerifyEmail() {
      const userId = this.userId;
      if (!userId) {
        throw new Meteor.Error('api.accounts.sendVerifyEmail.notLoggedIn');
      }
      Accounts.sendVerificationEmail(userId);
    },

    'Accounts.addEmail': function addEmail({ email }) {
      new SimpleSchema({
        email: { type: String, label: '新邮箱地址', regEx: SimpleSchema.RegEx.Email },
      }).validator({ clean: true, filter: false });
      const userId = this.userId;
      if (!userId) {
        throw new Meteor.Error('api.accounts.addEmail.notLoggedIn');
      }
      Accounts.addEmail(userId, email);
      Accounts.sendVerificationEmail(userId);
    },

    'Accounts.removeEmail': function removeEmail({ email }) {
      new SimpleSchema({
        email: { type: String, label: '待移除邮箱地址', regEx: SimpleSchema.RegEx.Email },
      }).validator({ clean: true, filter: false });
      const userId = this.userId;
      if (!userId) {
        throw new Meteor.Error('api.accounts.removeEmail.notLoggedIn');
      }
      Accounts.removeEmail(userId, email);
    },

  });

  const ACCOUNTS_METHODS = [
    'Accounts.createUser',
    'Accounts.sendVerifyEmail',
    'Accounts.addEmail',
    'Accounts.removeEmail',
  ];

  // Only allow 2 user operations per connection 5 second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(ACCOUNTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
