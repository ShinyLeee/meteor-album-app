import { Meteor } from 'meteor/meteor';
import { Collections } from '../collections/collection.js';

const incompleteCountDenormalizer = {

  afterInsertImage(image) {
    const uid = image.uid;
    Meteor.users.update({ _id: uid }, { $inc: { 'profile.images': 1 } });
    Collections.update({ uid, name: image.collection }, { $inc: { quantity: 1 } });
  },

  afterRemoveImage(image) {
    const uid = image.uid;
    Meteor.users.update({ _id: uid }, { $inc: { 'profile.images': -1 } });
    Collections.update({ uid, name: image.collection }, { $inc: { quantity: -1 } });
  },

};

export default incompleteCountDenormalizer;
