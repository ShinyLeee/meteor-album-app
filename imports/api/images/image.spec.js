/* eslint-disable no-unused-expressions */
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';
import {
  insertImage, removeImages, removeImagesToRecycle, recoveryImages, shiftImages, likeImage, unlikeImage,
} from './methods.js';
import { Users } from '../users/user.js';
import { Collections } from '../collections/collection.js';
import { Images } from './image.js';

if (Meteor.isServer) {
  import './server/publications.js';

  describe('image API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const image = Factory.create('image');
        assert.match(image.user, SimpleSchema.RegEx.Id, 'user field must be MongoId');
        assert.match(image.collection, SimpleSchema.RegEx.Id, 'collection field must be MongoId');
        assert.typeOf(image.name, 'string', 'name field must be String');
        assert.typeOf(image.ratio, 'number');
        assert.typeOf(image.shootAt, 'date');
        assert.typeOf(image.createdAt, 'date');
      });
    });

    describe('methods', () => {
      let userId;
      let collId;
      let imgId;

      beforeEach(() => {
        // Clear the fake database
        Users.remove({});
        Collections.remove({});
        Images.remove({});

        const curUser = Factory.create('user');
        const curColl = Factory.create('collection', { user: curUser._id });
        const curImg = Factory.create('image', { user: curUser._id, collection: curColl._id });
        _.times(2, () => Factory.create('image', { user: curUser._id, collection: curColl._id }));
        userId = curUser._id;
        collId = curColl._id;
        imgId = curImg._id;
      });

      describe('insertImage', () => {
        it('should only can insert image if you are logged in', () => {
          assert.throws(() => {
            insertImage._execute({}, Factory.tree('image', { user: userId, collection: collId }));
          }, Meteor.Error, /api.images.insertImage.notLoggedIn/);
        });

        it('should only can insert image by yourself', () => {
          const image = Factory.tree('image', { user: Random.id(), collection: collId });
          assert.throws(() => {
            insertImage._execute({ userId }, image);
          }, Meteor.Error, /api.images.insertImage.accessDenied/);
        });

        it('should insert image after method call', () => {
          // generate a image object without _id
          const image = Factory.tree('image', { user: userId, collection: collId });

          expect(Images.find().count()).to.equal(3); // expect have 3 pre created Image

          insertImage._execute({ userId }, image);
          expect(Images.find().count()).to.equal(4); // after execute method, expect have 4 Images
          expect(Images.findOne({ user: image.user, collection: image.collection })).to.be.ok;
        });
      });

      describe('removeImages', () => {
        it('should only can remove images if you are logged in', () => {
          assert.throws(() => {
            removeImages._execute({}, { selectImages: [imgId] });
          }, Meteor.Error, /api.images.removeImages.notLoggedIn/);
        });

        it('should remove images after method call', () => {
          expect(Images.find().count()).to.equal(3);

          removeImages._execute({ userId }, { selectImages: [imgId] });
          expect(Images.find().count()).to.equal(2);
        });
      });

      describe('removeImagesToRecycle / recoveryImages', () => {
        it('should only can remove to recycle / recovery image if you are logged in', () => {
          assert.throws(() => {
            removeImagesToRecycle._execute({}, { selectImages: [imgId] });
          }, Meteor.Error, /api.images.removeImagesToRecycle.notLoggedIn/);
          assert.throws(() => {
            recoveryImages._execute({}, { selectImages: [imgId] });
          }, Meteor.Error, /api.images.recoveryImages.notLoggedIn/);
        });

        it('should update deletedAt property after removeImagesToRecycle method call', () => {
          const newImg = Factory.create('image', { user: userId, collection: collId });
          expect(Images.find().count()).to.equal(4);

          removeImagesToRecycle._execute({ userId }, { selectImages: [imgId, newImg._id] });
          expect(Images.find({ deletedAt: { $ne: null } }).count()).to.equal(2);
        });

        it('should update deletedAt null after recoveryImages method call', () => {
          const newImg = Factory.create('image', { user: userId, collection: collId, deletedAt: new Date() });
          const newImg2 = Factory.create('image', { user: userId, collection: collId, deletedAt: new Date() });
          expect(Images.find({ deletedAt: { $ne: null } }).count()).to.equal(2);

          recoveryImages._execute({ userId }, { selectImages: [newImg._id, newImg2._id] });
          expect(Images.find({ deletedAt: { $ne: null } }).count()).to.equal(0);
        });
      });

      describe('shiftImages', () => {
        it('should only can shift if you are logged in', () => {
          assert.throws(() => {
            shiftImages._execute({}, { selectImages: [imgId], dest: collId });
          }, Meteor.Error, /api.images.shiftImages.notLoggedIn/);
        });

        it('should update image collection property after method call', () => {
          const newImg = Factory.create('image', { user: userId, collection: collId });
          const anotherColl = Factory.create('collection', { user: userId });
          expect(Images.find({ collection: collId }).count()).to.equal(4);
          expect(Images.find({ collection: anotherColl._id }).count()).to.equal(0);

          shiftImages._execute({ userId }, { selectImages: [imgId, newImg._id], dest: anotherColl._id });
          expect(Images.find({ collection: collId }).count()).to.equal(2, 'src should minus');
          expect(Images.find({ collection: anotherColl._id }).count()).to.equal(2, 'dest should add');
        });
      });

      describe('likeImage / unlikeImage', () => {
        it('should only can like or unlike image if you are logged in', () => {
          assert.throws(() => {
            likeImage._execute({}, { imageId: imgId, liker: userId });
          }, Meteor.Error, /api.images.likeImage.notLoggedIn/);
          assert.throws(() => {
            unlikeImage._execute({}, { imageId: imgId, unliker: userId });
          }, Meteor.Error, /api.images.unlikeImage.notLoggedIn/);
        });

        it('should update liker property after method call', () => {
          const anotherUser = Factory.create('user')._id;
          likeImage._execute({ userId: anotherUser }, { imageId: imgId, liker: anotherUser });
          expect(Images.findOne(imgId).liker).to.include(anotherUser);

          likeImage._execute({ userId }, { imageId: imgId, liker: userId }); // allow like self image
          expect(Images.findOne(imgId).liker).to.include(userId);

          likeImage._execute({ userId }, { imageId: imgId, liker: userId });
          expect(Images.findOne(imgId).liker).to.have.lengthOf(2, 'only allow one user liked once');

          unlikeImage._execute({ userId: anotherUser }, { imageId: imgId, unliker: anotherUser });
          expect(Images.findOne(imgId).liker).to.not.include(anotherUser);

          unlikeImage._execute({ userId }, { imageId: imgId, unliker: userId });
          expect(Images.findOne(imgId).liker).to.not.include(userId);
        });
      });
    });
  });
}
