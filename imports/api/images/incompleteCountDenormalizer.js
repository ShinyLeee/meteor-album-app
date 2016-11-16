import { Meteor } from 'meteor/meteor';
import { Collections } from '../collections/collection.js';

const incompleteCountDenormalizer = {

  afterInsertImage(image) {
    const uid = image.uid;
    Meteor.users.update(uid, {
      $inc: {
        'profile.images': 1,
      },
    }, (err) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }
      Collections.update({
        uid,
        name: image.collection,
      }, {
        $inc: { quantity: 1 },
      });
    });
  },

  afterRemoveImage(image) {
    const uid = image.uid;
    Meteor.users.update(uid, {
      $inc: {
        'profile.images': -1,
      },
    }, (err) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }
      Collections.update({
        uid,
        name: image.collection,
      }, {
        $inc: { quantity: -1 },
      });
    });
  },

  afterLikeImage(liker) {
    Meteor.users.update(liker, {
      $inc: {
        'profile.likes': 1,
      },
    });
  },

  afterUnlikeImage(unliker) {
    Meteor.users.update(unliker, {
      $inc: {
        'profile.likes': -1,
      },
    });
  },

};

export default incompleteCountDenormalizer;
