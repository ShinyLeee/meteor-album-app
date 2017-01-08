/* eslint-disable prefer-arrow-callback, meteor/audit-argument-checks */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Notes } from '../note.js';

Meteor.publish('Notes.own', function ownNotes(username) {
  new SimpleSchema({
    username: { type: String, label: '用户名', max: 20 },
  }).validator({ clean: true, filter: false });
  return Notes.find({
    receiver: username,
  });
});
