// /* eslint-disable meteor/audit-argument-checks */
// import includes from 'lodash/includes';
// import { Meteor } from 'meteor/meteor';
// import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
// import { Collections } from '../collection';

// Meteor.methods({
//   'Collections.query.all': function queryAllCollection() {
//     return Collections.find({ private: false });
//   },

//   'Collections.query.own': function queryOwnCollection() {
//     if (!this.userId) {
//       throw new Meteor.Error('api.Collections.query.own.notLoggedIn');
//     }
//     const own = Meteor.users.findOne(this.userId);
//     return Collections.find({ user: own.username });
//   },

//   'Collections.query.own.following': function queryOwnCollection() {
//     if (!this.userId) {
//       throw new Meteor.Error('api.Collections.query.own.following.notLoggedIn');
//     }
//     const own = Meteor.users.findOne(this.userId);
//     return Collections.find({
//       user: { $in: own.profile.following },
//       private: false,
//     });
//   },

//   'Collections.query.in.user': function querySpecificUserCollection(username) {
//     new SimpleSchema({
//       username: { type: String, label: '用户名', max: 10 },
//     }).validator({ clean: true, filter: false });
//     return Collections.find({
//       username,
//       private: false,
//     });
//   },

//   'Collections.query.in.user.following': function querySpecificUserFollowingCollection(username) {
//     new SimpleSchema({
//       username: { type: String, label: '用户名', max: 10 },
//     }).validator({ clean: true, filter: false });
//     const user = Meteor.users.findOne({ username });
//     return Collections.find({
//       user: { $in: user.profile.following },
//       private: false,
//     });
//   },

//   'Collections.query.limit': function queryLimitCollection(num) {
//     new SimpleSchema({
//       num: { type: Number, label: '限制数量' },
//     }).validator({ clean: true, filter: false });
//     return Collections.find(
//       { private: false },
//       { limit: num },
//     );
//   },
// });

// const COLLECTIONS_QUERY_METHODS = [
//   'Collections.query.all',
//   'Collections.query.own',
//   'Collections.query.own.following',
//   'Collections.query.in.user',
//   'Collections.query.in.user.following',
//   'Collections.query.limit',
// ];

//   // Only allow 2 user operations per connection per 5 seconds
// DDPRateLimiter.addRule({
//   name(name) {
//     return includes(COLLECTIONS_QUERY_METHODS, name);
//   },

//   // Rate limit per connection ID
//   connectionId() { return true; },
// }, 2, 5000);
