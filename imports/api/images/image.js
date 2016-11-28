import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import incompleteCountDenormalizer from './incompleteCountDenormalizer.js';

// Hook Our Own Collection Method
class ImagesCollection extends Mongo.Collection {
  insert(image, cb) {
    const img = image;
    img.createdAt = new Date();
    img.updatedAt = img.createdAt;
    const result = super.insert(img, cb);
    incompleteCountDenormalizer.afterInsertImage(img);
    return result;
  }
  update(selector, modifier, options, cb) {
    return super.update(selector, modifier, options, cb);
  }
  remove(selector, cb) {
    const result = super.remove(selector, cb);
    incompleteCountDenormalizer.afterRemoveImage(selector);
    return result;
  }
}

export const Images = new ImagesCollection('images');

Images.schema = new SimpleSchema({
  name: { type: String, label: '图片名', max: 10, optional: true },
  uid: { type: String, regEx: SimpleSchema.RegEx.Id },
  collection: { type: String, label: '分类' },
  ratio: { type: Number, label: '图片纵横比', decimal: true },
  url: { type: String, label: '图片地址' },
  likes: { type: Number, defaultValue: 0, optional: true },
  liker: { type: [String], defaultValue: [], optional: true },
  download: { type: Number, defaultValue: 0, optional: true },
  private: { type: Boolean, defaultValue: false, optional: true },
  shootAt: { type: Date },
  createdAt: { type: Date, defaultValue: new Date(), optional: true },
  updatedAt: { type: Date, defaultValue: new Date(), optional: true },
  deletedAt: { type: Date, defaultValue: null, optional: true },
});

Images.attachSchema(Images.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Images.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
