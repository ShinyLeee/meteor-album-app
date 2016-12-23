import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class CodesCollection extends Mongo.Collection {
  insert(note, cb) {
    const result = super.insert(note, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Codes = new CodesCollection('codes');

Codes.schema = new SimpleSchema({
  no: { type: String, label: '激活码' },
  isUsed: { type: Boolean, label: '是否已使用' },
  username: { type: String, label: '用户名' },
});

Codes.attachSchema(Codes.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Codes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
