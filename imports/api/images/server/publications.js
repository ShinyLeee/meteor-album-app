/* eslint-disable prefer-arrow-callback */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Images } from '../image.js';
import { Collections } from '../../collections/collection.js';

Meteor.publish('Images.all', function images() {
  return Images.find({ private: false, deletedAt: null });
});

Meteor.publish('Images.own', function ownImages() {
  const user = Meteor.users.findOne(this.userId);
  return Images.find({
    user: user && user.username,
    deletedAt: null,
  });
});

Meteor.publish('Images.liked', function likedImages() {
  return Images.find({
    liker: { $in: [this.userId] },
  });
});

Meteor.publish('Images.recycle', function inRecycleImages() {
  const user = Meteor.users.findOne(this.userId);
  return Images.find({
    user: user && user.username,
    deletedAt: { $ne: null },
  });
});

Meteor.publishComposite('Images.inCollection', function inCollection({ username, cname }) {
  new SimpleSchema({
    username: { type: String, label: '用户名', max: 20 },
    cname: { type: String, label: '相册名', max: 20 },
  }).validator({ clean: true, filter: false });
  return {
    find() {
      return Collections.find({
        name: cname,
        user: username,
      });
    },
    children: [{
      find(collection) {
        return Images.find({
          user: collection.user,
          collection: collection.name,
          deletedAt: null,
        });
      },
    }],
  };
});
