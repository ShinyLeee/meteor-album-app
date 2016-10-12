// import { Meteor } from 'meteor/meteor';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import './hooks.js';

// Meteor.users.schema = new SimpleSchema({
//   _id: { type: String, regEx: SimpleSchema.RegEx.Id },
//   username: { type: String },
//   services: { type: Object },
//   profile: { type: Object },
//   createdAt: { type: Date, defaultValue: new Date() },
//   updatedAt: { type: Date, defaultValue: new Date(), optional: true },
// });

// Meteor.users.attachSchema(Meteor.users.schema);

// Deny all client-side updates since we will be using methods to manage this collection
// Meteor.users.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });

