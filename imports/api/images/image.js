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
  uid: { type: String, regEx: SimpleSchema.RegEx.Id },
  user: { type: String, label: '用户名', max: 10 },
  collection: { type: String, label: '相册', max: 10 },
  name: { type: String, label: '图片名' },
  type: { type: String, label: '图片类型', defaultValue: 'jpg' },
  ratio: { type: Number, label: '图片纵横比', decimal: true },
  likes: { type: Number, defaultValue: 0, optional: true },
  liker: { type: [String], defaultValue: [], optional: true },
  download: { type: Number, defaultValue: 0, optional: true },
  private: { type: Boolean, defaultValue: false, optional: true },
  shootAt: { type: Date, label: '拍摄日期' },
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
