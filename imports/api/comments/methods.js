import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Comments } from './comment';

export const insertComment = new ValidatedMethod({
  name: 'comments.insert',
  mixins: [CallPromiseMixin],
  validate: Comments.simpleSchema().validator({ clean: true, filter: false }),
  run(comment) {
    if (!this.userId) {
      throw new Meteor.Error('api.comments.insert.notLoggedIn');
    }
    Comments.insert(comment);
  },
});

export const removeComment = new ValidatedMethod({
  name: 'comments.remove',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    commentId: { type: String, label: '评论Id' },
  }).validator({ clean: true, filter: false }),
  run({ commentId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.comments.remove.notLoggedIn');
    }
    Comments.remove(commentId);
  },
});

const COMMENTS_METHODS = _.map([
  insertComment,
  removeComment,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 user operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.includes(COMMENTS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}
