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
  title: { type: String, label: '标题', max: 20, optional: true },
  content: { type: String, label: '内容' },
  sender: { type: String, label: '发送者', max: 20 },
  receiver: { type: String, label: '接收者', max: 20 },
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
