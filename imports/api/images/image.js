import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Hook Our Own Collection Method
class ImagesCollection extends Mongo.Collection {
  insert(image, cb) {
    const img = image;
    img.createdAt = img.createdAt || new Date();
    return super.insert(img, cb);
  }
  update(selector, modifier) {
    return super.update(selector, modifier);
  }
  remove(selector, cb) {
    return super.remove(selector, cb);
  }
}

export const Images = new ImagesCollection('images');

Images.schema = new SimpleSchema({
  _id: { type: String, regEx: SimpleSchema.RegEx.Id },
  name: { type: String, max: 20 },  // Pic Name
  uid: { type: String, regEx: SimpleSchema.RegEx.Id },
  username: { type: String },
  tag: { type: String },
  url: { type: String, regEx: SimpleSchema.RegEx.Url },
  like: { type: Number, defaultValue: 0, optional: true },
  liker: { type: [String], defaultValue: null, optional: true },
  download: { type: Number, defaultValue: 0, optional: true },
  private: { type: Boolean, defaultValue: false, optional: true },
  detail: { type: Object },
  createdAt: { type: Date, defaultValue: new Date(), optional: true },
  updatedAt: { type: Date, defaultValue: new Date(), optional: true },
});

Images.attachSchema(Images.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Images.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
