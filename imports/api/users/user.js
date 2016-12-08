import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Users = Meteor.users;

Users.schema = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  createdAt: { type: Date, defaultValue: new Date() },
  services: { type: Object, optional: true, blackbox: true },
  username: { type: String, regEx: /^([a-z]|[A-Z])[\w_]{5,19}$/, optional: true },
  emails: { type: [Object] },
  'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
  'emails.$.verified': { type: Boolean },
  profile: { type: Object, optional: true, blackbox: true },
});

Meteor.users.attachSchema(Users.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

