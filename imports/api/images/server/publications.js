/* eslint prefer-arrow-callback: 0 */
import { Meteor } from 'meteor/meteor';
import { Images } from '../image.js';

Meteor.publish('Images.all', function images() {
  return Images.find();
});

Meteor.publish('Images.ownImages', function ownImages() {
  return Images.find({
    uid: this.userId,
  });
});
