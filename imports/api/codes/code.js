import { Meteor } from 'meteor/meteor';
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
  no: { type: Number, label: '激活码', denyUpdate: true },
  isUsed: { type: Boolean, label: '是否已使用', defaultValue: false, optional: true },
  createdAt: { type: Date, denyUpdate: true },
  usedAt: { type: Date, optional: true },
});

Codes.attachSchema(Codes.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Codes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isTest) {
  import faker from 'faker';
  import { Factory } from 'meteor/dburles:factory';

  Factory.define('code', Codes, {
    no: () => faker.random.number(),
    createdAt: () => new Date(),
  });
}

