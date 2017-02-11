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
    outline: { type: String, label: '内容大纲' },
    content: { type: Object, label: '富文本内容[Delta格式]', blackbox: true },
  }).validator({ clean: true, filter: false }),
  run({ diaryId, outline, content }) {
    if (!this.userId) {
      throw new Meteor.Error('api.diarys.update.notLoggedIn');
    }
    Diarys.update(
      { _id: diaryId },
      { $set: { outline, content, updatedAt: new Date() } }
    );
  },
});

export const removeDiary = new ValidatedMethod({
  name: 'diarys.remove',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    diaryId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator({ clean: true, filter: false }),
  run({ diaryId }) {
    if (!this.userId) {
      throw new Meteor.Error('api.diarys.remove.notLoggedIn');
    }
    Diarys.remove(diaryId);
  },
});

const DIARYS_METHODS = _.pluck([
  insertDiary,
  updateDiary,
  removeDiary,
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
