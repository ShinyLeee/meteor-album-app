import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Images } from './image.js';

Meteor.methods({
  'images.insert': function createImage(obj) {
    check(obj, Object);
    // Make sure the user is logged in before insert an image
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Images.insert({
      name: obj.name,
      uid: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      tag: obj.tag,
      url: obj.url,
      detail: obj.detail,
    });
  },
});
