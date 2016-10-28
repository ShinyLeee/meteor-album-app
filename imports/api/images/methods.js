import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Images } from './image.js';

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';

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

export const likeImage = new ValidatedMethod({
  name: 'images.like',
  validate: new SimpleSchema({
    imageId: { type: String, regEx: SimpleSchema.RegEx.Id },
    liker: { type: String },
  }).validator({ clean: true, filter: false }),
  run({ imageId, liker }) {
    // const image = Images.findOne(imageId);
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    Images.update(imageId, {
      $inc: { likes: 1 },
      $push: { liker },
    });
    incompleteCountDenormalizer.afterLikeImage(liker);
  },
});

// Get list of all method names on Images
const IMAGES_METHODS = _.pluck([
  insertImage,
  likeImage,
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
