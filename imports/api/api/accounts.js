import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

if (Meteor.isServer) {
  Meteor.methods({
    'Accounts.sendVerifyEmail': function sendVerifyEmail() {
      const userId = this.userId;
      if (!userId) {
        throw new Meteor.Error('api.user.sendVerifyEmail.notLoggedIn');
      }
      Accounts.sendVerificationEmail(userId);
    },

    'Accounts.addEmail': function addEmail({ email }) {
      new SimpleSchema({
        email: { type: String, label: '新邮箱地址', regEx: SimpleSchema.RegEx.Email },
      }).validator({ clean: true, filter: false });
      const userId = this.userId;
      if (!userId) {
        throw new Meteor.Error('api.user.addEmail.notLoggedIn');
      }
      Accounts.addEmail(userId, email);
      Accounts.sendVerificationEmail(userId);
    },

  });

  const ACCOUNTS_METHODS = [
    'Accounts.sendVerifyEmail',
    'Accounts.addEmail',
  ];

  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(ACCOUNTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
