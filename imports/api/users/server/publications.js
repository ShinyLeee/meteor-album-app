/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('Users.all', function allUser() {
  return Meteor.users.find(
    {},
    { fields: { username: 1, profile: 1 } }
  );
});

Meteor.publish('Users.others', function otherUsers() {
  return Meteor.users.find(
    { _id: { $ne: this.userId } },
    { fields: { username: 1, profile: 1 } }
  );
});

Meteor.publish('Users.limit', function limit(num) {
  new SimpleSchema({
    num: { type: Number, label: '限制数量' },
  }).validator({ clean: true, filter: false });
  return Meteor.users.find(
    {},
    { limit: num, fields: { username: 1, profile: 1 } }
  );
});
