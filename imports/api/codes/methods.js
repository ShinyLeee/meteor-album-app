import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Codes } from './code.js';

export const checkCode = new ValidatedMethod({
  name: 'codes.check',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    codeNo: { type: String },
  }).validator({ clean: true, filter: false }),
  run({ codeNo }) {
    if (this.userId) {
      throw new Meteor.Error(403, 'Access Denied');
    }
    const isExist = Codes.findOne({ no: codeNo, isUsed: false });
    return isExist;
  },
});

export const useCode = new ValidatedMethod({
  name: 'codes.use',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    codeNo: { type: String },
  }).validator({ clean: true, filter: false }),
  run({ codeNo }) {
    if (this.userId) {
      throw new Meteor.Error(403, 'Access Denied');
    }
    Codes.update({ no: codeNo, isUsed: false }, { $set: { isUsed: true } });
  },
});
// Get list of all method names on Collections
const COLLECTIONS_METHODS = _.pluck([
  checkCode,
  useCode,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(COLLECTIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 1000);
}
