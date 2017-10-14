import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Images } from '../images/image';

class CollectionCollection extends Mongo.Collection {
  insert(collection, cb) {
    const result = super.insert(collection, cb);
    return result;
  }
  remove(selector, cb) {
    // when selector is not an empty Object
    // remove collection will also remove its image
    if (Object.keys(selector).length !== 0) {
      const removeColl = this.findOne(selector);
      Images.find(
        { user: removeColl.user, collection: removeColl.name },
        { fields: { _id: 1 } },
      ).forEach((image) => Images.remove(image._id));
    }

    const result = super.remove(selector, cb);
    return result;
  }
}

export const Collections = new CollectionCollection('collections');

Collections.schema = new SimpleSchema({
  name: { type: String, label: '相册名', max: 20 },
  user: { type: String, max: 20, denyUpdate: true },
  cover: { type: String, label: '封面图片' },
  private: { type: Boolean, defaultValue: false, optional: true },
  createdAt: { type: Date, denyUpdate: true },
  updatedAt: { type: Date },
});

Collections.attachSchema(Collections.schema);

// Deny all client-side updates since we will be using methods to manage this collection
Collections.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Collections.helpers({
  isLoggedIn() {
    return !!this.userId;
  },
  images() {
    return Images.find(
      { user: this.user, collection: this.name, deletedAt: null },
      { sort: { createdAt: -1 } },
    );
  },
});
