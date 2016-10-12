import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class NotesCollection extends Mongo.Collection {
  insert(note, cb) {
    const n = note;
    n.createdAt = n.createdAt || new Date();
    return super.insert(n, cb);
  }
  update(selector, modifier) {
    return super.update(selector, modifier);
  }
  remove(selector, cb) {
    return super.remove(selector, cb);
  }
}

export const Notes = new NotesCollection('notes');

Notes.schema = new SimpleSchema({
  title: { type: String, max: 20 },
  content: { type: String }, // TODO max content length limit
  sender: { type: String, regEx: SimpleSchema.RegEx.Id },
  receiver: { type: String, regEx: SimpleSchema.RegEx.Id },
  isRead: { type: Boolean, defaultValue: false, optional: true },
  sendAt: { type: Date, defaultValue: new Date(), optional: true },
  createdAt: { type: Date, defaultValue: new Date(), optional: true },
});

Notes.attachSchema(Notes.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Notes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
