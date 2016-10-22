import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Images } from './image.js';

export const insertImage = new ValidatedMethod({
  name: 'images.insert',
  validate: Images.simpleSchema().validator({ clean: true, filter: false }),
  run(image) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    Images.insert(image);
  },
});

// Get list of all method names on Images
const IMAGES_METHODS = _.pluck([
  insertImage,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(IMAGES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 1000);
}
