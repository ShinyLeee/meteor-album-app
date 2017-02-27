import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const sourceDomain = Meteor.settings.public.sourceDomain;

export const Users = Meteor.users;

export const defaultUserProfile = {
  nickname: '',
  intro: '',
  avatar: `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`,
  cover: `${sourceDomain}/GalleryPlus/Default/default-cover.jpg`,
  following: [],
  followers: [],
  settings: {
    allowNoti: true,
    allowMsg: true,
    allowVisitHome: true,
    allowVisitColl: true,
  },
};

Users.schema = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
  services: { type: Object, optional: true, blackbox: true },
  username: { type: String, label: '用户名', max: 20, denyUpdate: true },
  emails: { type: [Object], optional: true },
  'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
  'emails.$.verified': { type: Boolean },
  profile: { type: Object, blackbox: true },
  createdAt: { type: Date, denyUpdate: true },
});

Users.attachSchema(Users.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isTest) {
  import faker from 'faker';
  import { Factory } from 'meteor/dburles:factory';
  import { limitStrLength } from '/imports/utils/utils.js';

  Factory.define('user', Users, {
    username: () => limitStrLength(faker.internet.userName(), 20),
    profile: () => defaultUserProfile,
    createdAt: () => new Date(),
  });
}
