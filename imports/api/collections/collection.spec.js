/* eslint-disable no-unused-expressions */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { insertCollection, removeCollection, lockCollection, mutateCollectionCover } from './methods.js';
import { Users, defaultUserProfile } from '../users/user.js';
import { Images } from '../images/image.js';
import { Collections } from './collection.js';
import { Comments } from '../comments/comment.js';

if (Meteor.isServer) {
  import './server/publications.js';

  describe('COLLECTIONS API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const collection = Factory.create('collection');
        assert.typeOf(collection.name, 'string', 'name field must be String');
        assert.typeOf(collection.user, 'string', 'user field must unique username');
        assert.typeOf(collection.cover, 'string', 'cover field must be a url');
        assert.typeOf(collection.private, 'boolean');
        assert.typeOf(collection.createdAt, 'date');
        assert.typeOf(collection.updatedAt, 'date');
      });
    });

    describe('publication', () => {
      let curUser;
      before(() => {
        Users.remove({});
        Collections.remove({});

        const profile = Object.assign({}, defaultUserProfile, { following: ['tester'] });
        curUser = Factory.create('user', { profile });

        // Create 2 collection belong to current user
        Factory.create('collection', { user: curUser.username });
        Factory.create('collection', { user: curUser.username, private: true });

        // Create 2 collection belong to another user but one is private
        Factory.create('collection', { user: 'tester' });
        Factory.create('collection', { user: 'tester', private: true });
      });

      describe('Collections.all', () => {
        it('should send all public collection documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Collections.all', (collections) => {
            expect(collections.collections).to.have.length(2);
            done();
          });
        });
      });

      describe('Collections.own', () => {
        it('should only send current user\'s all collection documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Collections.own', (collections) => {
            expect(collections.collections).to.have.length(2);
            done();
          });
        });
      });

      describe('Collections.ownFollowing', () => {
        it('should send own following users\' public collection documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Collections.ownFollowing', (collections) => {
            expect(collections.collections[0].user).to.equal('tester');
            expect(collections.collections).to.have.length(1);
            done();
          });
        });
      });

      describe('Collection.inUser', () => {
        it('should send specific user\'s public collection documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Collections.inUser', 'tester', (collections) => {
            expect(collections.collections).to.have.length(1);
            done();
          });
        });
      });

      describe('Collection.inUserFollowing', () => {
        it('should send specific user and its following users\' public collection documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Collections.inUserFollowing', curUser.username, (collections) => {
            expect(collections.collections[0].user).to.equal('tester');
            expect(collections.collections).to.have.length(1);
            done();
          });
        });
      });

      describe('Collections.limit', () => {
        it('should only send specific number collections documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Collections.limit', 2, (collections) => {
            expect(collections.collections).to.have.length(2);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let curUser;
      let curColl;

      beforeEach(() => {
        // Clear
        Users.remove({});
        Images.remove({});
        Collections.remove({});

        // Create a user in that list
        curUser = Factory.create('user');
        curColl = Factory.create('collection', { user: curUser.username });
      });

      describe('insertCollection', () => {
        it('should only can insert if you are logged in', () => {
          assert.throws(() => {
            insertCollection._execute({}, curColl);
          }, Meteor.Error, /api.collections.insert.notLoggedIn/);
        });

        it('should insert collection after method call', () => {
          expect(Collections.find({ user: curUser.username }).count()).to.equal(1);

          const methodInvocation = { userId: curUser._id };
          // generate a collection object without _id
          const args = Factory.tree('collection', { user: curUser.username });

          insertCollection._execute(methodInvocation, args);
          expect(Collections.find({ user: curUser.username }).count()).to.equal(2);
        });

        it('should set private field based on User\'s profile.settings.allowVisitColl field', () => {
          const anotherUser = Factory.create('user');
          Users.update({ username: anotherUser.username }, { $set: { 'profile.settings.allowVisitColl': false } });

          const methodInvocation = { userId: anotherUser._id };
          const args = Factory.tree('collection', { user: anotherUser.username });

          insertCollection._execute(methodInvocation, args);
          expect(Collections.findOne({ name: args.name, user: anotherUser.username }).private).to.be.true;
        });
      });

      // TODO make test check is Qiniu remote image also remove
      describe('removeCollection', () => {
        it('should only can remove if you are logged in', () => {
          assert.throws(() => {
            removeCollection._execute({}, curColl);
          }, Meteor.Error, /api.collections.remove.notLoggedIn/);
        });

        it('should remove collection after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const args = { username: curUser.username, collName: curColl.name };

          expect(Collections.find({ user: curUser.username }).count()).to.equal(1);

          removeCollection._execute(methodInvocation, args);
          expect(Collections.find({ user: curUser.username }).count()).to.equal(0);
        });

        it('should also remove its images after method call', () => {
          _.times(2, () => Factory.create('image', { user: curUser.username, collection: curColl.name }));
          expect(Images.find({ user: curUser.username, collection: curColl.name }).count()).to.equal(2);

          const methodInvocation = { userId: curUser._id };
          const args = { username: curUser.username, collName: curColl.name };

          removeCollection._execute(methodInvocation, args);
          expect(Images.find({ user: curUser.username, collection: curColl.name }).count()).to.equal(0);
        });

        it('should also remove its images\'s comments after method call', () => {
          const img = Factory.create('image', { user: curUser.username, collection: curColl.name });
          Factory.create('comment', { discussion_id: img._id });
          expect(Images.find({ user: curUser.username, collection: curColl.name }).count()).to.equal(1);
          expect(Comments.find({ discussion_id: img._id }).count()).to.equal(1);

          const methodInvocation = { userId: curUser._id };
          const args = { username: curUser.username, collName: curColl.name };

          removeCollection._execute(methodInvocation, args);
          expect(Images.find({ user: curUser.username, collection: curColl.name }).count()).to.equal(0);
          expect(Comments.find({ discussion_id: img._id }).count()).to.equal(0);
        });
      });

      describe('lockCollection', () => {
        it('should only can lock if you are logged in', () => {
          const methodInvocation = {};
          const args = {
            username: curUser.username,
            collId: curColl._id,
            collName: curColl.name,
            privateStat: curColl.private,
          };
          assert.throws(() => {
            lockCollection._execute(methodInvocation, args);
          }, Meteor.Error, /api.collections.lock.notLoggedIn/);
        });

        it('should update private field after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const args = {
            username: curUser.username,
            collId: curColl._id,
            collName: curColl.name,
            privateStat: curColl.private,
          };
          lockCollection._execute(methodInvocation, args);
          expect(Collections.findOne(curColl._id).private).to.be.true;

          const coll = Collections.findOne(curColl._id);
          const newArgs = {
            username: curUser.username,
            collId: coll._id,
            collName: coll.name,
            privateStat: coll.private,
          };
          lockCollection._execute(methodInvocation, newArgs);
          expect(Collections.findOne(curColl._id).private).to.be.false;
        });

        it('should also update Images\' private field after method call', () => {
          _.times(2, () => Factory.create('image', { user: curUser.username, collection: curColl.name }));
          expect(Images.find({
            user: curUser.username,
            collection: curColl.name,
            private: false,
          }).count()).to.equal(2);

          const methodInvocation = { userId: curUser._id };
          const args = {
            username: curUser.username,
            collId: curColl._id,
            collName: curColl.name,
            privateStat: curColl.private,
          };

          lockCollection._execute(methodInvocation, args);
          const publicImageNum = Images.find({
            user: curUser.username,
            collection: curColl.name,
            private: false,
          }).count();
          const privateImageNum = Images.find({
            user: curUser.username,
            collection: curColl.name,
            private: true,
          }).count();
          expect(publicImageNum).to.equal(0);
          expect(privateImageNum).to.equal(2);
        });
      });

      describe('mutateCollectionCover', () => {
        it('should only work if you are logged in', () => {
          const methodInvocation = {};
          const args = {
            collId: curColl._id,
            cover: 'http://image.yehuihui.cn/test.jpg',
          };
          assert.throws(() => {
            mutateCollectionCover._execute(methodInvocation, args);
          }, Meteor.Error, /api.collections.mutateCover.notLoggedIn/);
        });

        it('should update cover field after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const args = {
            collId: curColl._id,
            cover: 'http://image.yehuihui.cn/test.jpg',
          };
          mutateCollectionCover._execute(methodInvocation, args);
          expect(Collections.findOne(curColl._id).cover).to.equal(args.cover);
        });
      });
    });
  });
}
