import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class NotesCollection extends Mongo.Collection {
  insert(note, cb) {
    const result = super.insert(note, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Notes = new NotesCollection('notes');

Notes.schema = new SimpleSchema({
  title: { type: String, max: 20, optional: true },
  content: { type: String, label: '内容', max: 256 },
  sender: { type: String, label: '发送者', regEx: SimpleSchema.RegEx.Id },
  receiver: { type: String, label: '接收者', regEx: SimpleSchema.RegEx.Id },
  isRead: { type: Boolean, defaultValue: false, optional: true },
  sendAt: { type: Date, label: '发送时间' },
  createdAt: { type: Date, denyUpdate: true },
});

Notes.attachSchema(Notes.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Notes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isTest) {
  import { Factory } from 'meteor/dburles:factory';
  import faker from 'faker';
  import { limitStrLength } from '/imports/utils/utils.js';

  Factory.define('note', Notes, {
    title: () => limitStrLength(faker.hacker.noun(), 20),
    content: () => faker.lorem.sentence(),
    sender: () => Factory.get('user'),
    receiver: () => Factory.get('user'),
    sendAt: () => new Date(),
    createdAt: () => new Date(),
  });
}
