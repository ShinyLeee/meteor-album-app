import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Collections } from './collection.js';

export const insertCollection = new ValidatedMethod({
  name: 'collections.insert',
  validate: Collections.simpleSchema().validator({ clean: true, filter: false }),
  run(collection) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Collections.insert(collection);
  },
});

export const removeCollection = new ValidatedMethod({
  name: 'collections.remove',
  validate: new SimpleSchema({
    uid: { type: String, regEx: SimpleSchema.RegEx.Id },
    colName: { type: String, label: '相册名' },
  }).validator({ clean: true, filter: false }),
  run({ uid, colName }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Collections.remove({ uid, name: colName });
  },
});

export const mutateCollectionCover = new ValidatedMethod({
  name: 'collection.mutateCover',
  validate: new SimpleSchema({
    cover: { type: String, label: '封面图片', regEx: SimpleSchema.RegEx.Url },
    uid: { type: String, regEx: SimpleSchema.RegEx.Id },
    colName: { type: String, label: '相册名' },
  }).validator({ clean: true, filter: false }),
  run({ cover, uid, colName }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Collections.update({ uid, name: colName }, { $set: { cover } });
  },
});

// Get list of all method names on Collections
const COLLECTIONS_METHODS = _.pluck([
  insertCollection,
  removeCollection,
  mutateCollectionCover,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(COLLECTIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 1, 1000);
}
