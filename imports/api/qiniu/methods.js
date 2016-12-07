import { Meteor } from 'meteor/meteor';
// import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

if (Meteor.isServer) {
  import qiniu from 'qiniu';

  const bucket = Meteor.settings.private.qiniu.bucket;

  Meteor.methods({
    'qiniu.getUptoken': function getUptoken({ user, collection }) {
      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
      }
      new SimpleSchema({
        user: { type: String, label: '用户名' },
        collection: { type: String, label: '相册名', max: 10 },
      }).validator({ clean: true, filter: false });

      const key = `${user}/${collection}/`;

      const putPolicy = new qiniu.rs.PutPolicy(bucket);
      const token = putPolicy.token();

      const response = {
        uptoken: token,
        key,
      };
      return response;
    },

    'qiniu.move': function move({ keys }) {
      new SimpleSchema({
        keys: { type: [Object] },
        'keys.$.src': { type: String },
        'keys.$.dest': { type: String },
      }).validator({ clean: true, filter: false });

      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
      }

      if (!keys) {
        throw new Meteor.Error('Keys can\'t be empty, please check it out');
      }
      const client = new qiniu.rs.Client();

      const pairs = keys.map((key) => {
        const pathSrc = new qiniu.rs.EntryPath(bucket, key.src);
        const pathDest = new qiniu.rs.EntryPath(bucket, key.dest);

        const pair = new qiniu.rs.EntryPathPair(pathSrc, pathDest);
        return pair;
      });

      const batchMoveSync = Meteor.wrapAsync(client.batchMove);
      const results = batchMoveSync(pairs);

      const response = { results };
      return response;
    },

    'qiniu.remove': function remove({ keys }) {
      new SimpleSchema({
        keys: { type: [String] },
      }).validator({ clean: true, filter: false });

      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
      }

      if (!keys) {
        throw new Meteor.Error('Keys can\'t be empty, please check it out');
      }
      const client = new qiniu.rs.Client();

      const pathes = keys.map((key) => {
        const path = new qiniu.rs.EntryPath(bucket, key);
        return path;
      });

      const batchDeleteSync = Meteor.wrapAsync(client.batchDelete);
      const results = batchDeleteSync(pathes);

      const response = { results };
      return response;
    },

  });

  // const QINIU_METHODS = _.pluck([
  //   getUptoken,
  //   move,
  // ], 'name');

  // Only allow 1 user operations per connection per second
  // DDPRateLimiter.addRule({
  //   name(name) {
  //     return _.contains(QINIU_METHODS, name);
  //   },

  //   // Rate limit per connection ID
  //   connectionId() { return true; },
  // }, 1, 1000);
}
