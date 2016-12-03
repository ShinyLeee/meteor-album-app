import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Notes } from './note.js';

/**
 * Validator Options
 * Clean: Intended to be called prior to validation to avoid any avoidable validation errors.
 * Filter: Filter out properties not found in the schema? True by default.
 */
export const insertNote = new ValidatedMethod({
  name: 'notes.insert',
  validate: Notes.simpleSchema().validator({ clean: true, filter: false }),
  run(note) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Notes.insert(note);
  },
});

// Get list of all method names on Notes
const NOTES_METHODS = _.pluck([
  insertNote,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 note operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(NOTES_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 1000);
}
