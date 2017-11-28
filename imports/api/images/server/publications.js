/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Images } from '../image';
import { Collections } from '../../collections/collection';

Meteor.publish('Images.specific', function specificImage(id) {
  new SimpleSchema({
    id: { type: String, label: '相片Id', regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false });
  return Images.find(id);
});

Meteor.publish('Images.all', function images() {
  return Images.find({
    private: false,
    deletedAt: null,
  });
});

Meteor.publish('Images.own', function ownImages() {
  const user = Meteor.users.findOne(this.userId);
  return Images.find({
    user: user && user.username,
    deletedAt: null,
  });
});

Meteor.publish('Images.inUser', function targetUserImages(username) {
  new SimpleSchema({
    user: { type: String, label: '用户名', max: 10 },
  }).validator({ clean: true, filter: false });
  return Images.find({
    user: username,
    private: false,
  });
});

Meteor.publish('Images.liked', function likedImages(username) {
  new SimpleSchema({
    username: { type: String, label: '用户名', max: 20, optional: true },
  }).validator({ clean: true, filter: false });
  const user = Meteor.users.findOne(this.userId);
  const isOwner = user.username === username;
  const imageSelector = {
    liker: { $in: [username] },
  };
  if (!isOwner) {
    imageSelector.private = false;
  }
  return Images.find(imageSelector);
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
      // not restrict private field because this publication only for Owner
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
