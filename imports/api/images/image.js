import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Comments } from '../comments/comment.js';

class ImagesCollection extends Mongo.Collection {
  insert(image, cb) {
    const result = super.insert(image, cb);
    return result;
  }
  remove(selector, cb) {
    // when selector is not an empty Object
    // remove image will also remove its comments
    if (Object.keys(selector).length !== 0) {
      Comments.remove({ discussion_id: selector });
    }
    const result = super.remove(selector, cb);
    return result;
  }
}

export const Images = new ImagesCollection('images');

Images.schema = new SimpleSchema({
  user: { type: String, max: 20, denyUpdate: true },
  collection: { type: String, max: 20 },
  name: { type: String, label: '图片名' },
  type: { type: String, label: '图片类型', defaultValue: 'jpg' },
  dimension: { type: [Number], label: '图片长宽', maxCount: 2 },
  color: { type: String, label: '图片平均色调', defaultValue: '#fff' },
  liker: { type: [String], defaultValue: [], optional: true },
  view: { type: Number, defaultValue: 0, optional: true },
  private: { type: Boolean, defaultValue: false, optional: true },
  shootAt: { type: Date, label: '拍摄日期' },
  createdAt: { type: Date, denyUpdate: true },
  updatedAt: { type: Date },
  deletedAt: { type: Date, defaultValue: null, optional: true },
});

Images.attachSchema(Images.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Images.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Images.helpers({
  isLoggedIn() {
    return !!this.userId;
  },
});
