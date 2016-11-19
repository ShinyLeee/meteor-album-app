import { Meteor } from 'meteor/meteor';

const incompleteCountDenormalizer = {

  afterInsertCollection(collection) {
    const uid = collection.uid;
    Meteor.users.update(uid, {
      $inc: {
        'profile.collections': 1,
      },
    });
  },

  afterRemoveCollection(collection) {
    const uid = collection.uid;
    Meteor.users.update(uid, {
      $inc: {
        'profile.collections': -1,
      },
    });
  },

};

export default incompleteCountDenormalizer;
