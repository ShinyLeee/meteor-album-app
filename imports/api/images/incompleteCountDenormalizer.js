import { Meteor } from 'meteor/meteor';

const incompleteCountDenormalizer = {

  afterInsertImage(image) {
    const uid = image.uid;
    Meteor.users.update(uid, {
      $inc: {
        'profile.images': 1,
      },
    });
  },

  afterRemoveImage(image) {
    const uid = image.uid;
    Meteor.users.update(uid, {
      $inc: {
        'profile.images': -1,
      },
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
