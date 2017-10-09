import _ from 'lodash';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Images } from './image.js';
import { Collections } from '../collections/collection.js';

export const insertImage = new ValidatedMethod({
  name: 'images.insert',
  mixins: [CallPromiseMixin],
  validate: Images.simpleSchema().validator({ clean: true, filter: false }),
  run(image) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.insert.notLoggedIn');
    }
    if (Meteor.users.findOne(this.userId).username !== image.user) {
      throw new Meteor.Error('api.images.insert.accessDenied');
    }

    // TODO get dest collection private status only ONCE
    const newImage = image;
    const dest = Collections.findOne({ name: image.collection, user: image.user });
    newImage.private = dest && dest.private;
    Images.insert(newImage);
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
    _.forEach(selectImages, (imgId) => Images.remove(imgId));
  },
});

export const removeImagesToRecycle = new ValidatedMethod({
  name: 'images.removeToRecycle',
  mixins: [CallPromiseMixin],
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

// 恢复的照片必须根据其恢复相册的加密状态来设置
export const recoveryImages = new ValidatedMethod({
  name: 'images.recovery',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selectImages: { type: [String], label: '被选择图片Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ selectImages }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.recovery.notLoggedIn');
    }

    const username = Meteor.users.findOne(this.userId).username;

    _.forEach(selectImages, (imageId) => {
      const destName = Images.findOne(imageId).collection;
      const dest = Collections.findOne({ name: destName, user: username });
      const destPrivateStat = dest && dest.private;
      Images.update(
        { _id: imageId },
        { $set: { deletedAt: null, private: destPrivateStat } }
      );
    });
  },
});


// required destPrivateStat
// for update Images' private status based on dest collection
export const shiftImages = new ValidatedMethod({
  name: 'images.shift',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selectImages: { type: [String], label: '被选择图片Id', regEx: SimpleSchema.RegEx.Id },
    dest: { type: String, label: '目标相册名', max: 20 },
    destPrivateStat: { type: Boolean, label: '目标相册加密状态' },
  }).validator({ clean: true, filter: false }),
  run({ selectImages, dest, destPrivateStat }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.shift.notLoggedIn');
    }

    if (selectImages.length === 0) return;

    Images.update(
      { _id: { $in: selectImages } },
      { $set: { collection: dest, private: destPrivateStat } },
      { multi: true }
    );
  },
});

export const likeImage = new ValidatedMethod({
  name: 'images.like',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    imageId: { type: String, regEx: SimpleSchema.RegEx.Id },
    liker: { type: String, label: '用户名', max: 20 },
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
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    imageId: { type: String, regEx: SimpleSchema.RegEx.Id },
    unliker: { type: String, label: '用户名', max: 20 },
  }).validator({ clean: true, filter: false }),
  run({ imageId, unliker }) {
    if (!this.userId) {
      throw new Meteor.Error('api.images.unlike.notLoggedIn');
    }
    Images.update(imageId, { $pull: { liker: unliker } });
  },
});

export const incView = new ValidatedMethod({
  name: 'images.inc',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    imageIds: { type: [String], regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ imageIds }) {
    Images.update(
    { _id: { $in: imageIds } },
    { $inc: { view: 1 } },
    { multi: true }
  );
  },
});

// Get list of all method names on Images
const IMAGES_METHODS = _.map([
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
      return _.includes(IMAGES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
