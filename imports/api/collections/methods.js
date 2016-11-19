import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Collections } from './collection.js';

export const insertCollection = new ValidatedMethod({
  name: 'collections.insert',
  validate: Collections.simpleSchema().validator({ clean: true, filter: false }),
  run(collection) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    Collections.insert(collection);
  },
});

// Get list of all method names on Collections
const COLLECTIONS_METHODS = _.pluck([
  insertCollection,
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
