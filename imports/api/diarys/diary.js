import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class DiarysCollection extends Mongo.Collection {
  insert(diary, cb) {
    const result = super.insert(diary, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Diarys = new DiarysCollection('diarys');

Diarys.schema = new SimpleSchema({
  user: { type: String, max: 20, denyUpdate: true },
  title: { type: String, label: '标题', max: 20, denyUpdate: true },
  outline: { type: String, label: '内容大纲', max: 80 },
  content: { type: Object, label: '富文本内容[Delta格式]', blackbox: true },
  createdAt: { type: Date, denyUpdate: true },
  updatedAt: { type: Date },
});

Diarys.attachSchema(Diarys.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Diarys.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
