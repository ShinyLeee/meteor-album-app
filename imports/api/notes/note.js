import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class NotesCollection extends Mongo.Collection {
  insert(note, cb) {
    const result = super.insert(note, cb);
    return result;
  }
  remove(selector, cb) {
    return super.remove(selector, cb);
  }
}

export const Notes = new NotesCollection('notes');

Notes.schema = new SimpleSchema({
  title: { type: String, max: 20, optional: true },
  content: { type: String, label: '内容', max: 256 },
  sender: { type: String, label: '发送者', regEx: SimpleSchema.RegEx.Id },
  receiver: { type: String, label: '接收者', regEx: SimpleSchema.RegEx.Id },
  isRead: { type: Boolean, defaultValue: false, optional: true },
  sendAt: { type: Date, label: '发送时间', defaultValue: new Date() },
  createdAt: { type: Date, defaultValue: new Date(), optional: true },
});

Notes.attachSchema(Notes.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Notes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
