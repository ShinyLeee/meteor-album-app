/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Diarys } from '../diary.js';

Meteor.publish('Diarys.own', function ownDiarys() {
  const user = Meteor.users.findOne(this.userId);
  return Diarys.find({
    user: user && user.username,
  });
});
