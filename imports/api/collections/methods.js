import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Images } from '../images/image.js';
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
    colName: { type: String, label: '相册名' },
  }).validator({ clean: true, filter: false }),
  run({ colName }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Collections.remove({ uid: this.userId, name: colName });
  },
});

export const lockCollection = new ValidatedMethod({
  name: 'collection.lock',
  validate: new SimpleSchema({
    colId: { type: String, regEx: SimpleSchema.RegEx.Id },
    colName: { type: String, max: 10 },
    privateStatus: { type: Boolean },
  }).validator({ clean: true, filter: false }),
  run({ colId, colName, privateStatus }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    Collections.update(colId, { $set: { private: !privateStatus } });
    Images.update(
      { collection: colName },
      { $set: { private: !privateStatus } },
      { multi: true }
    );
  },
});

export const mutateCollectionCover = new ValidatedMethod({
  name: 'collection.mutateCover',
  validate: new SimpleSchema({
    cover: { type: String, label: '封面图片' },
    colName: { type: String, label: '相册名' },
  }).validator({ clean: true, filter: false }),
  run({ cover, colName }) {
    if (!this.userId) {
      throw new Meteor.Error('user.accessDenied');
    }
    return Collections.update({ uid: this.userId, name: colName }, { $set: { cover } });
  },
});

// Get list of all method names on Collections
const COLLECTIONS_METHODS = _.pluck([
  insertCollection,
  removeCollection,
  lockCollection,
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
