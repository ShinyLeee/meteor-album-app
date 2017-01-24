/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Notes } from '../note.js';

Meteor.publish('Notes.receiver', function receiverNotes() {
  const user = Meteor.users.findOne(this.userId);
  return Notes.find({
    receiver: user && user.username,
  });
});

Meteor.publish('Notes.sender', function senderNotes() {
  const user = Meteor.users.findOne(this.userId);
  return Notes.find({
    sender: user && user.username,
  });
});
