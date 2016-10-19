import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Users = Meteor.users;

// const profileSchema = new SimpleSchema({
//   nickname: { type: String },
//   cover: { type: String },
//   avatar: { type: String },
//   likes: { type: Number, defaultValue: 0, optional: true },
//   images: { type: Number, defaultValue: 0, optional: true },
//   notes: { type: Number, defaultValue: 0, optional: true },
//   collections: { type: Number, defaultValue: 0, optional: true },
//   relater: { type: Object, defaultValue: null, optional: true },
//   settings: { type: Object, optional: true, blackbox: true },
// });

// const profileContext = profileSchema.newContext();

Users.schema = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  createdAt: { type: Date },
  services: { type: Object, optional: true, blackbox: true },
  username: { type: String, regEx: /^([a-z]|[A-Z])[\w_]{5,19}$/ },
  emails: { type: [Object], optional: true },
  'emails.$.address': { type: String, optional: true, regEx: SimpleSchema.RegEx.Email },
  'emails.$.verified': { type: Boolean, optional: true },
  profile: { type: Object, optional: true, blackbox: true },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Note that when using this package, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  // roles: {
  //   type: String,
  //   optional: true,
  //   blackbox: true,
  //   allowedValues: ['booker', 'provider', 'admin'],
  // },
});

Meteor.users.attachSchema(Users.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

