import map from 'lodash/map';
import includes from 'lodash/includes';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Notes } from './note';

/**
 * Validator Options
 * Clean: Intended to be called prior to validation to avoid any avoidable validation errors.
 * Filter: Filter out properties not found in the schema? True by default.
 */
export const insertNote = new ValidatedMethod({
  name: 'notes.insert',
  mixins: [CallPromiseMixin],
  validate: Notes.simpleSchema().validator({ clean: true, filter: false }),
  run(note) {
    if (!this.userId) {
      throw new Meteor.Error('api.notes.insert.notLoggedIn');
    }
    const receiver = Meteor.users.findOne({ username: note.receiver });
    if (!receiver) {
      throw new Meteor.Error('api.notes.insert.userNotFound', '接受用户不存在');
    }
    return Notes.insert(note);
  },
});

export const readAllNotes = new ValidatedMethod({
  name: 'notes.readAll',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    receiver: { type: String, label: '接受者', max: 20 },
  }).validator({ clean: true, filter: false }),
  run({ receiver }) {
    if (!this.userId) {
      throw new Meteor.Error('api.notes.readAll.notLoggedIn');
    }
    const unReadNotesNum = Notes.find({ receiver, isRead: { $ne: true } }).count();
    if (unReadNotesNum === 0) {
      throw new Meteor.Error('api.notes.readAll.emptyUnreadNotes', '您没有未读的消息');
    }
    Notes.update(
      { receiver, isRead: false },
      { $set: { isRead: true } },
      { multi: true },
    );
  },
});

export const readNote = new ValidatedMethod({
  name: 'notes.read',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    noteId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ noteId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.notes.read.notLoggedIn');
    }
    Notes.update(
      noteId,
      { $set: { isRead: true } },
    );
  },
});

// Get list of all method names on Notes
const NOTES_METHODS = map([
  insertNote,
  readAllNotes,
  readNote,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 note operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return includes(NOTES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
