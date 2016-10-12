import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notes } from './note.js';

Meteor.methods({
  'notes.insert': function createNote(obj) {
    check(obj, Object);
    // Make sure the user is logged in before insert a Note
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Notes.insert({
      title: obj.title,
      content: obj.content,
      sender: this.userId || obj.sender,
      receiver: obj.receiver,
      sendAt: obj.sendAt,
    });
  },
});
