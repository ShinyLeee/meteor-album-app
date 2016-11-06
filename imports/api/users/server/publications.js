/* eslint prefer-arrow-callback: 0 */
import { Meteor } from 'meteor/meteor';

Meteor.publish('Users.allUser', function allUser() {
  return Meteor.users.find({});
});

Meteor.publish('Users.otherUsers', function otherUsers() {
  return Meteor.users.find({
    _id: { $ne: this.userId },
  }, {
    fields: { username: 1, profile: 1 },
  });
});
