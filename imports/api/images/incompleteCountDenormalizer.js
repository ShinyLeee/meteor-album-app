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
          throw new Meteor.Error('Error happen when updating image\'s profile', err);
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

};

export default incompleteCountDenormalizer;
