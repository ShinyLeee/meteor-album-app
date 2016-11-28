import { Meteor } from 'meteor/meteor';
import { Collections } from '../collections/collection.js';

const incompleteCountDenormalizer = {

  afterInsertImage(image) {
    const uid = image.uid;
    Meteor.users.update(
      { _id: uid },
      { $inc: { 'profile.images': 1 } },
      (err) => {
        if (err) {
          console.log(err); // eslint-disable-line no-console
        }
        Collections.update({
          uid,
          name: image.collection,
        }, {
          $inc: { quantity: 1 },
        });
      }
    );
  },

  afterRemoveImagesToRecycle(uid, colName, count) {
    Meteor.users.update(
      { _id: uid },
      { $inc: { 'profile.images': -count } },
      (err) => {
        if (err) {
          throw new Meteor.Error('Error happen when updating User\'s profile', err);
        }
        Collections.update(
          { uid, name: colName },
          { $inc: { quantity: -count },
        });
      }
    );
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
