/* eslint prefer-arrow-callback: 0 */
import { Meteor } from 'meteor/meteor';

Meteor.publish('registerUser', function registerUser() {
  return Meteor.users.find({
    _id: { $ne: this.userId },
  }, {
    fields: { username: 1 },
  });
});
