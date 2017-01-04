import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import { getRandomInt, limitStrLength } from '/imports/utils/utils.js';

class CollectionCollection extends Mongo.Collection {
  insert(collection, cb) {
    const result = super.insert(collection, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Collections = new CollectionCollection('collections');

Collections.schema = new SimpleSchema({
  name: { type: String, label: '相册名', max: 20 },
  uid: { type: String, regEx: SimpleSchema.RegEx.Id },
  user: { type: String, label: '用户名', max: 20 },
  cover: { type: String, label: '封面图片' },
  private: { type: Boolean, defaultValue: false, optional: true },
  createdAt: { type: Date, denyUpdate: true },
  updatedAt: { type: Date, optional: true },
});

Collections.attachSchema(Collections.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Collections.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Factory.define('collection', Collections, {
  name: () => limitStrLength(faker.hacker.noun(), 20),
  uid: () => Factory.get('user'),
  user: () => limitStrLength(faker.internet.userName(), 20),
  cover: () => `/img/pattern/VF_ac${getRandomInt(1, 28)}.jpg`,
  createdAt: () => new Date(),
});
