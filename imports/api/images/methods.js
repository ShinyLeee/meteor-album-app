import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import moment from 'moment';
import { Images } from './image.js';

export const insertImage = new ValidatedMethod({
  name: 'images.insert',
  validate: Images.simpleSchema().validator({ clean: true, filter: false }),
  run(image) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.insert.notLoggedIn');
    }
    const username = Meteor.users.findOne(this.userId).username;
    if (username !== image.user) {
      throw new Meteor.Error('api.images.insert.accessDenied');
    }
    return Images.insert(image);
  },
});

export const removeImages = new ValidatedMethod({
  name: 'images.remove',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selectImages: { type: [String], label: '被选择图片Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ selectImages }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.remove.notLoggedIn');
    }
    Images.remove({ _id: { $in: selectImages } });
  },
});

export const removeImagesToRecycle = new ValidatedMethod({
  name: 'images.removeToRecycle',
  validate: new SimpleSchema({
    selectImages: { type: [String], label: '被选择图片Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ selectImages }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.removeToRecycle.notLoggedIn');
    }
    const deletedAt = moment().add(1, 'M').toDate();

    Images.update(
      { _id: { $in: selectImages } },
      { $set: { deletedAt } },
      { multi: true }
    );
  },
});

export const recoveryImages = new ValidatedMethod({
  name: 'images.recovery',
  validate: new SimpleSchema({
    selectImages: { type: [String], label: '被选择图片Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ selectImages }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.recovery.notLoggedIn');
    }
    Images.update(
      { _id: { $in: selectImages } },
      { $set: { deletedAt: null } },
      { multi: true }
    );
  },
});

export const shiftImages = new ValidatedMethod({
  name: 'images.shift',
  validate: new SimpleSchema({
    selectImages: { type: [String], label: '被选择图片Id', regEx: SimpleSchema.RegEx.Id },
    dest: { type: String, label: '目标相册名', max: 20 },
  }).validator({ clean: true, filter: false }),
  run({ selectImages, dest }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.shift.notLoggedIn');
    }
    const count = selectImages.length;

    if (!count) return;

    Images.update(
      { _id: { $in: selectImages } },
      { $set: { collection: dest } },
      { multi: true }
    );
  },
});

export const likeImage = new ValidatedMethod({
  name: 'images.like',
  validate: new SimpleSchema({
    imageId: { type: String, regEx: SimpleSchema.RegEx.Id },
    liker: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ imageId, liker }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.like.notLoggedIn');
    }
    Images.update(imageId, { $addToSet: { liker } });
  },
});

export const unlikeImage = new ValidatedMethod({
  name: 'images.unlike',
  validate: new SimpleSchema({
    imageId: { type: String, regEx: SimpleSchema.RegEx.Id },
    unliker: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ imageId, unliker }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.unlike.notLoggedIn');
    }
    Images.update(imageId, { $pull: { liker: unliker } });
  },
});

// Get list of all method names on Images
const IMAGES_METHODS = _.pluck([
  // insertImage, // allow call this method within 1 second
  removeImages,
  removeImagesToRecycle,
  recoveryImages,
  shiftImages,
  likeImage,
  unlikeImage,
], 'name');

if (Meteor.isServer) {
  // Only allow 2 operations per connection per 5 second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(IMAGES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
