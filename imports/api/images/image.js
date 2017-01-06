import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class ImagesCollection extends Mongo.Collection {
  insert(image, cb) {
    const result = super.insert(image, cb);
    return result;
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Images = new ImagesCollection('images');

Images.schema = new SimpleSchema({
  user: { type: String, regEx: SimpleSchema.RegEx.Id, denyUpdate: true },
  collection: { type: String, regEx: SimpleSchema.RegEx.Id },
  name: { type: String, label: '图片名' },
  type: { type: String, label: '图片类型', defaultValue: 'jpg' },
  ratio: { type: Number, label: '图片纵横比', decimal: true },
  liker: { type: [String], defaultValue: [], optional: true },
  download: { type: Number, defaultValue: 0, optional: true },
  shootAt: { type: Date, label: '拍摄日期' },
  createdAt: { type: Date, denyUpdate: true },
  updatedAt: { type: Date, optional: true },
  deletedAt: { type: Date, defaultValue: null, optional: true },
});

Images.attachSchema(Images.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Images.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isTest) {
  import { Factory } from 'meteor/dburles:factory';
  import faker from 'faker';
  import { getRandomArbitrary } from '/imports/utils/utils.js';

  Factory.define('image', Images, {
    user: () => Factory.get('user'),
    collection: () => Factory.get('collection'),
    name: () => faker.random.uuid(),
    type: () => 'jpg',
    ratio: () => Math.round(getRandomArbitrary(0.5, 2) * 10) / 10,
    shootAt: () => new Date(),
    createdAt: () => new Date(),
  });
}
