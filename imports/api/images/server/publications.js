/* eslint prefer-arrow-callback: 0 */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Images } from '../image.js';
import { Collections } from '../../collections/collection.js';

Meteor.publish('Images.all', function images() {
  return Images.find({ deletedAt: null });
});

Meteor.publish('Images.own', function ownImages() {
  return Images.find({
    uid: this.userId,
    deletedAt: null,
  });
});

Meteor.publish('Images.liked', function likedImages() {
  return Images.find({
    liker: { $in: [this.userId] },
  });
});

Meteor.publish('Images.recycle', function inRecycleImages() {
  return Images.find({
    uid: this.userId,
    deletedAt: { $ne: null },
  });
});

Meteor.publishComposite('Images.inCollection', function spec(collId) {
  new SimpleSchema({
    collId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false });
  return {
    find() {
      return Collections.find(collId);
    },
    children: [{
      find(collection) {
        return Images.find({ collection: collection._id });
      },
    }],
  };
});

Meteor.publish('Images.spec', function spec({ username, collName }) {
  new SimpleSchema({
    username: { type: String, label: '用户名', max: 10 },
    collName: { type: String, label: '相册名', max: 10 },
  }).validator({ clean: true, filter: false });
  return Images.find({
    user: username,
    deletedAt: null,
    collection: collName,
  });
});
