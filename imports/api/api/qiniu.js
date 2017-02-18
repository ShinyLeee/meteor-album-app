import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

if (Meteor.isServer) {
  import qiniu from 'qiniu';

  const bucket = Meteor.settings.private.qiniu.bucket;

  Meteor.methods({
    'Qiniu.getUptoken': function getUptoken() {
      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
      }
      const putPolicy = new qiniu.rs.PutPolicy(bucket);
      const uptoken = putPolicy.token();

      const response = { uptoken };
      return response;
    },

    'Qiniu.move': function move({ keys }) {
      new SimpleSchema({
        keys: { type: [Object] },
        'keys.$.src': { type: String },
        'keys.$.dest': { type: String },
      }).validator({ clean: true, filter: false });

      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
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

    'Qiniu.remove': function remove({ keys }) {
      new SimpleSchema({
        keys: { type: [String] },
      }).validator({ clean: true, filter: false });

      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
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

    'Qiniu.stat': function getStat({ key }) {
      new SimpleSchema({
        keys: { type: [String] },
      }).validator({ clean: true, filter: false });

      if (!this.userId) {
        throw new Meteor.Error('user.accessDenied');
      }

      const client = new qiniu.rs.Client();

      const statSync = Meteor.wrapAsync(client.stat);
      const results = statSync(bucket, key);

      const response = { results };
      return response;
    },
  });

  const QINIU_METHODS = [
    'Qiniu.getUptoken',
    'Qiniu.move',
    'Qiniu.remove',
  ];

  // Only allow 2 operations per connection per 5 second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(QINIU_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
