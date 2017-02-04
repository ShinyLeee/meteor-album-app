/* eslint-disable no-unused-expressions */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
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

  describe('IMAGES API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const image = Factory.create('image');
        assert.typeOf(image.user, 'string', 'user field must unique username');
        assert.typeOf(image.collection, 'string', 'collection field must be specific collection name');
        assert.typeOf(image.name, 'string', 'name field must be String');
        assert.typeOf(image.ratio, 'number');
        assert.typeOf(image.shootAt, 'date');
        assert.typeOf(image.createdAt, 'date');
        assert.typeOf(image.updatedAt, 'date');
      });
    });

    describe('publication', () => {
      let curUser;
      let collOne;
      let collTwo;
      before(() => {
        Users.remove({});
        Collections.remove({});
        Images.remove({});
        // Total create 1 USER 2 COLLECTION 5 IMAGES
        curUser = Factory.create('user');
        collOne = Factory.create('collection', { user: curUser.username });
        collTwo = Factory.create('collection', { user: curUser.username });

        // Create 2 images belong to user and collOne
        _.times(2, () => Factory.create('image', { user: curUser.username, collection: collOne.name }));

        // Create 1 image belong to user but collTwo
        Factory.create('image', { user: curUser.username, collection: collTwo.name });

        // Create a image has been removed to recycle
        Factory.create('image', { user: curUser.username, collection: collOne.name, deletedAt: new Date() });

        // Create a image liked by self but now is private
        Factory.create('image', { user: curUser.username, collection: collOne.name, liker: [curUser.username], private: true });

        // Create a image which is private
        Factory.create('image', { user: 'tester', collection: 'test-coll', private: true });

        // Create a image belong to another user and another collection
        Factory.create('image', { user: 'tester', collection: 'test-coll', liker: [curUser.username] });
      });

      describe('Images.all', () => {
        it('should send all image documents that deletedAt field null and private false', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Images.all', (collections) => {
            expect(collections.images).to.have.length(4);
            done();
          });
        });
      });

      describe('Images.own', () => {
        it('should only all image documents owned by self and deletedAt field null', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Images.own', (collections) => {
            expect(collections.images).to.have.length(4);
            done();
          });
        });
      });

      describe('Images.liked', () => {
        it('should send own liked image documents without username parameter', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Images.liked', (collections) => {
            expect(collections.images).to.have.length(1);
            expect(collections.images[0].liker).to.include(curUser.username);
            done();
          });
        });

        it('should send current user liked image documents with username parameter', (done) => {
          const collector = new PublicationCollector({ userId: Random.id() });
          collector.collect('Images.liked', curUser.username, (collections) => {
            expect(collections.images).to.have.length(1);
            expect(collections.images[0].liker).to.include(curUser.username);
            done();
          });
        });
      });

      describe('Images.recycle', () => {
        it('should only send current user\'s deleted image documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Images.recycle', (collections) => {
            expect(collections.images).to.have.length(1);
            done();
          });
        });
      });

      describe('Images.inCollection', () => {
        it('should send all images for specific collection', (done) => {
          const collector = new PublicationCollector();
          collector.collect(
            'Images.inCollection',
            { username: curUser.username, cname: collOne.name },
            (collections) => {
              assert.equal(collections.collections.length, 1);
              assert.equal(collections.images.length, 3);
              done();
            }
          );
        });
      });
    });

    describe('methods', () => {
      let curUser;
      let collOne;
      let imgId;

      beforeEach(() => {
        // Clear the fake database
        Users.remove({});
        Collections.remove({});
        Images.remove({});

        curUser = Factory.create('user');
        collOne = Factory.create('collection', { user: curUser.username });
        imgId = Factory.create('image', { user: curUser.username, collection: collOne.name })._id;
        _.times(2, () => Factory.create('image', { user: curUser.username, collection: collOne.name }));
      });

      describe('insertImage', () => {
        it('should only can insert image if you are logged in', () => {
          assert.throws(() => {
            const newImg = Factory.tree('image', { user: curUser.username, collection: collOne.name });
            insertImage._execute({}, newImg);
          }, Meteor.Error, /api.images.insert.notLoggedIn/);
        });

        it('should only can insert image by yourself', () => {
          const newImg = Factory.tree('image', { user: 'tester', collection: 'test-coll' });
          assert.throws(() => {
            insertImage._execute({ userId: curUser._id }, newImg);
          }, Meteor.Error, /api.images.insert.accessDenied/);
        });

        it('should insert image after method call', () => {
          // generate a image object without _id
          const newImg = Factory.tree('image', { user: curUser.username, collection: collOne.name });

          expect(Images.find().count()).to.equal(3); // expect have 3 pre created Image

          insertImage._execute({ userId: curUser._id }, newImg);
          expect(Images.find().count()).to.equal(4); // after execute method, expect have 4 Images
          expect(Images.findOne({ user: newImg.user, collection: newImg.collection })).to.be.ok;
        });

        it('should set private field based on target collection', () => {
          const anotherColl = Factory.create('collection', { user: curUser.username, private: true });
          const newImg = Factory.tree('image', { user: curUser.username, collection: collOne.name });
          const newImg2 = Factory.tree('image', { user: curUser.username, collection: anotherColl.name });

          const methodInvocation = { userId: curUser._id };
          insertImage._execute(methodInvocation, newImg);
          insertImage._execute(methodInvocation, newImg2);

          expect(Images.findOne({ collection: collOne.name }).private).to.be.false;
          expect(Images.findOne({ collection: anotherColl.name }).private).to.be.true;
        });
      });

      describe('removeImages', () => {
        it('should only can remove images if you are logged in', () => {
          assert.throws(() => {
            removeImages._execute({}, { selectImages: [imgId] });
          }, Meteor.Error, /api.images.remove.notLoggedIn/);
        });

        it('should remove images after method call', () => {
          expect(Images.find().count()).to.equal(3);

          removeImages._execute({ userId: curUser._id }, { selectImages: [imgId] });
          expect(Images.find().count()).to.equal(2);
        });
      });

      describe('removeImagesToRecycle / recoveryImages', () => {
        it('should only can remove to recycle / recovery image if you are logged in', () => {
          assert.throws(() => {
            removeImagesToRecycle._execute({}, { selectImages: [imgId] });
          }, Meteor.Error, /api.images.removeToRecycle.notLoggedIn/);
          assert.throws(() => {
            recoveryImages._execute({}, { selectImages: [imgId] });
          }, Meteor.Error, /api.images.recovery.notLoggedIn/);
        });

        it('should update deletedAt property after removeImagesToRecycle method call', () => {
          const newImg = Factory.create('image', { user: curUser.username, collection: collOne.name });
          expect(Images.find().count()).to.equal(4);

          removeImagesToRecycle._execute({ userId: curUser._id }, { selectImages: [imgId, newImg._id] });
          expect(Images.find({ deletedAt: { $ne: null } }).count()).to.equal(2);
        });

        it('should update deletedAt null after recoveryImages method call', () => {
          const newImg = Factory.create(
            'image',
            { user: curUser.username, collection: collOne.name, deletedAt: new Date() }
          );
          const newImg2 = Factory.create(
            'image',
            { user: curUser.username, collection: collOne.name, deletedAt: new Date() }
          );
          expect(Images.find({ deletedAt: { $ne: null } }).count()).to.equal(2);

          recoveryImages._execute({ userId: curUser._id }, { selectImages: [newImg._id, newImg2._id] });
          expect(Images.find({ deletedAt: { $ne: null } }).count()).to.equal(0);
        });

        it('[recoveryImages] should set private field based on target collection ', () => {
          const anotherColl = Factory.create('collection', { user: curUser.username, private: true });
          const newImg = Factory.create(
            'image',
            { user: curUser.username, collection: collOne.name, deletedAt: new Date() }
          );
          const newImg2 = Factory.create(
            'image',
            { user: curUser.username, collection: anotherColl.name, deletedAt: new Date() }
          );
          expect(Images.findOne(newImg._id).private).to.be.false;
          expect(Images.findOne(newImg2._id).private).to.be.false;

          const methodInvocation = { userId: curUser._id };
          recoveryImages._execute(methodInvocation, { selectImages: [newImg._id] });
          recoveryImages._execute(methodInvocation, { selectImages: [newImg2._id] });

          expect(Images.findOne(newImg._id).private).to.be.false;
          expect(Images.findOne(newImg2._id).private).to.be.true;
        });
      });

      describe('shiftImages', () => {
        it('should only can shift if you are logged in', () => {
          assert.throws(() => {
            shiftImages._execute({}, { selectImages: [imgId], dest: collOne.name, destPrivateStat: false });
          }, Meteor.Error, /api.images.shift.notLoggedIn/);
        });

        it('should update image collection property after method call', () => {
          const newImg = Factory.create('image', { user: curUser.username, collection: collOne.name });
          const anotherColl = Factory.create('collection', { user: curUser.username });
          expect(Images.find({ collection: collOne.name }).count()).to.equal(4);
          expect(Images.find({ collection: anotherColl.name }).count()).to.equal(0);

          shiftImages._execute(
            { userId: curUser._id },
            { selectImages: [imgId, newImg._id], dest: anotherColl.name, destPrivateStat: false }
          );

          expect(Images.find({ collection: collOne.name }).count()).to.equal(2, 'source collection should minus');
          expect(Images.find({ collection: anotherColl.name }).count()).to.equal(2, 'dest collection should add');
        });

        it('should set image private field based on target collection', () => {
          const anotherColl = Factory.create('collection', { user: curUser.username, private: true });
          expect(Images.findOne(imgId).collection).to.equal(collOne.name);
          expect(Images.findOne(imgId).private).to.be.false;

          shiftImages._execute(
            { userId: curUser._id },
            { selectImages: [imgId], dest: anotherColl.name, destPrivateStat: true }
          );

          expect(Images.findOne(imgId).collection).to.equal(anotherColl.name);
          expect(Images.findOne(imgId).private).to.be.true;
        });
      });

      describe('likeImage / unlikeImage', () => {
        it('should only can like or unlike image if you are logged in', () => {
          assert.throws(() => {
            likeImage._execute({}, { imageId: imgId, liker: curUser.username });
          }, Meteor.Error, /api.images.like.notLoggedIn/);
          assert.throws(() => {
            unlikeImage._execute({}, { imageId: imgId, unliker: curUser.username });
          }, Meteor.Error, /api.images.unlike.notLoggedIn/);
        });

        it('should update liker property after method call', () => {
          const anotherUid = Random.id();
          likeImage._execute({ userId: anotherUid }, { imageId: imgId, liker: anotherUid });
          expect(Images.findOne(imgId).liker).to.include(anotherUid, 'should add liker id after likeImage');

          // allow like self image
          likeImage._execute({ userId: curUser.username }, { imageId: imgId, liker: curUser.username });
          expect(Images.findOne(imgId).liker).to.include(curUser.username, 'should support like self image');

          likeImage._execute({ userId: curUser.username }, { imageId: imgId, liker: curUser.username });
          expect(Images.findOne(imgId).liker).to.have.lengthOf(2, 'only allow one user liked once');

          unlikeImage._execute({ userId: anotherUid }, { imageId: imgId, unliker: anotherUid });
          expect(Images.findOne(imgId).liker).to.not.include(anotherUid, 'should remove like id after unlikeImage');

          unlikeImage._execute({ userId: anotherUid }, { imageId: imgId, unliker: curUser.username });
          expect(Images.findOne(imgId).liker).to.not.include(curUser.username);
        });
      });
    });
  });
}
