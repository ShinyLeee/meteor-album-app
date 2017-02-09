import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Diarys } from './diary.js';

export const insertDiary = new ValidatedMethod({
  name: 'diarys.insert',
  mixins: [CallPromiseMixin],
  validate: Diarys.simpleSchema().validator({ clean: true, filter: false }),
  run(diary) {
    if (!this.userId) {
      throw new Meteor.Error('api.diarys.insert.notLoggedIn');
    }
    Diarys.insert(diary);
  },
});

export const updateDiary = new ValidatedMethod({
  name: 'diarys.update',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    diaryId: { type: String, regEx: SimpleSchema.RegEx.Id },
    title: { type: String, label: '标题', max: 20 },
    content: { type: String, label: '内容' },
  }).validator({ clean: true, filter: false }),
  run({ diaryId, title, content }) {
    if (!this.userId) {
      throw new Meteor.Error('api.diarys.update.notLoggedIn');
    }
    Diarys.update(
      { _id: diaryId },
      { $set: { title, content, updatedAt: new Date() } }
    );
  },
});

const DIARYS_METHODS = _.pluck([
  insertDiary,
  updateDiary,
], 'name');

if (Meteor.isServer) {
  // Only allow 1 diary operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(DIARYS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 2, 5000);
}