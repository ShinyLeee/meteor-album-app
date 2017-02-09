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
  title: { type: String, label: '标题', max: 20 },
  content: { type: String, label: '内容' },
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

if (Meteor.isTest) {
  import faker from 'faker';
  import { Factory } from 'meteor/dburles:factory';
  import { limitStrLength } from '/imports/utils/utils.js';

  Factory.define('diary', Diarys, {
    user: () => limitStrLength(faker.internet.userName(), 20),
    title: () => limitStrLength(faker.hacker.noun(), 20),
    content: () => faker.lorem.sentence(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  });
}
