// /* eslint-disable meteor/audit-argument-checks */
// import includes from 'lodash/includes';
// import { Meteor } from 'meteor/meteor';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

// Meteor.methods({
//   'Users.query.all': function queryAllUser() {
//     return Meteor.users.find({}, {
//       fields: { username: 1, profile: 1 },
//     });
//   },

//   'Users.query.others': function queryOtherUser() {
//     if (!this.userId) {
//       throw new Meteor.Error('api.Users.query.others.notLoggedIn');
//     }
//     return Meteor.users.find(
//       { _id: { $ne: this.userId } },
//       { fields: { username: 1, profile: 1 } },
//     );
//   },

//   'Users.query.limit': function queryOwnCollection(num) {
//     new SimpleSchema({
//       num: { type: Number, label: '限制数量' },
//     }).validator({ clean: true, filter: false });
//     return Meteor.users.find({}, {
//       limit: num,
//       fields: { username: 1, profile: 1 },
//     });
//   },
// });

// const USERS_QUERY_METHODS = [
//   'Users.query.all',
//   'Users.query.others',
//   'Users.query.limit',
// ];

//   // Only allow 2 user operations per connection per 5 seconds
// DDPRateLimiter.addRule({
//   name(name) {
//     return includes(USERS_QUERY_METHODS, name);
//   },

//   // Rate limit per connection ID
//   connectionId() { return true; },
// }, 2, 5000);
