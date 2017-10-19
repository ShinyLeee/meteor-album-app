import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Codes } from './code';

export const checkCode = new ValidatedMethod({
  name: 'codes.check',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    codeNo: { type: String, label: '激活码' },
  }).validator({ clean: true, filter: false }),
  run({ codeNo }) {
    if (this.userId) {
      throw new Meteor.Error('api.codes.check.hasLoggedIn');
    }
    const isExist = !!Codes.findOne({ no: codeNo, isUsed: false });
    return isExist;
  },
});

export const useCode = new ValidatedMethod({
  name: 'codes.use',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    codeNo: { type: String, label: '激活码' },
  }).validator({ clean: true, filter: false }),
  run({ codeNo }) {
    if (this.userId) {
      throw new Meteor.Error('api.codes.use.hasLoggedIn');
    }
    Codes.update(
      { no: codeNo, isUsed: false },
      { $set: { isUsed: true, usedAt: new Date() } },
    );
  },
});

const CODES_METHODS = _.map([
  checkCode,
  useCode,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.includes(CODES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
