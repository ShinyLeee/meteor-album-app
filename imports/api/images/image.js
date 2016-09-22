import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Images = new Mongo.Collection('images');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish images that are public or belong to the current user !TODOS
  Meteor.publish('images', () => Images.find());
}

Meteor.methods({
  'images:insert': (obj) => {
    check(obj, Object);
    // Make sure the user is logged in before inserting a task
    // if (!this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }
    Images.insert({
      name: obj.name,
      tag: obj.tag,
      url: obj.url,
      like: 0,
      download: 0,
      detail: obj.detail,
      createdAt: obj.createdAt,
      updatedAt: obj.createdAt,
      deletedAt: null,
      // owner: this.userId,
      // username: Meteor.users.findOne(this.userId).username,
    });
  },
});
