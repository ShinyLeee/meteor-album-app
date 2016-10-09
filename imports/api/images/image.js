import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
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
  name: { type: String, max: 20 },
  user: { type: String, regEx: SimpleSchema.RegEx.Id },
  username: { type: String },
  tag: { type: String },
  url: { type: String, regEx: SimpleSchema.RegEx.Url },
  like: { type: Number, defaultValue: 0 },
  liker: { type: [String], defaultValue: null },
  download: { type: Number, defaultValue: 0 },
  detail: { type: Object },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

Images.attachSchema(Images.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Images.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish images that are public or belong to the current user !TODOS
  Meteor.publish('images', () => Images.find());
}

Meteor.methods({
  'images.insert': function createImage(obj) {
    check(obj, Object);
    // Make sure the user is logged in before insert an image
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Images.insert({
      name: obj.name,
      userId: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      tag: obj.tag,
      url: obj.url,
      like: 0,
      download: 0,
      detail: obj.detail,
      createdAt: obj.createdAt,
      updatedAt: obj.createdAt,
    });
  },
});
