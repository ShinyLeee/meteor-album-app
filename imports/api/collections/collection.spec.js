/* eslint-disable no-unused-expressions */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { insertCollection, removeCollection, lockCollection, mutateCollectionCover } from './methods.js';
import { Users } from '../users/user.js';
import { Images } from '../images/image.js';
import { Collections } from './collection.js';

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
      });
    });

    describe('publication', () => {
      let curUser;
      before(() => {
        Users.remove({});
        Collections.remove({});

        curUser = Factory.create('user');

        // Create 2 collection belong to current user
        _.times(2, () => Factory.create('collection', { user: curUser.username }));

        // Create 1 collection belong to another user
        Factory.create('collection', { user: 'tester' });
      });

      describe('Collections.all', () => {
        it('should send all collection documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Collections.all', (collections) => {
            expect(collections.collections).to.have.length(3);
            done();
          });
        });
      });

      describe('Collections.own', () => {
        it('should only send current user\'s collection documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Collections.own', (collections) => {
            expect(collections.collections).to.have.length(2);
            done();
          });
        });
      });

      describe('Collection.inUser', () => {
        it('should send specific user\'s collection documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Collections.inUser', 'tester', (collections) => {
            expect(collections.collections).to.have.length(1);
            done();
          });
        });
      });

      describe('Collection.collNames', () => {
        it('should only send current user\'s collections documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Collections.collNames', (collections) => {
            expect(collections.collections).to.have.length(2);
            done();
          });
        });

        it('should only send name field to client', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Collections.collNames', (collections) => {
            expect(collections.collections[0]).to.have.all.keys(['_id', 'name']);
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
      });

      describe('removeCollection', () => {
        it('should only can remove if you are logged in', () => {
          assert.throws(() => {
            removeCollection._execute({}, curColl);
          }, Meteor.Error, /api.collections.remove.notLoggedIn/);
        });

        it('should remove collection after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const args = {
            username: curUser.username,
            collId: curColl._id,
            collName: curColl.name,
          };

          expect(Collections.find({ user: curUser.username }).count()).to.equal(1);

          removeCollection._execute(methodInvocation, args);
          expect(Collections.find({ user: curUser.username }).count()).to.equal(0);
        });

        it('should also remove images which belong to the collection after method call', () => {
          _.times(2, () => Factory.create('image', { user: curUser.username, collection: curColl.name }));
          expect(Images.find({ user: curUser.username, collection: curColl.name }).count()).to.equal(2);

          const methodInvocation = { userId: curUser._id };
          const args = {
            username: curUser.username,
            collId: curColl._id,
            collName: curColl.name,
          };

          removeCollection._execute(methodInvocation, args);
          expect(Images.find({ user: curUser.username, collection: curColl.name }).count()).to.equal(0);
        });
      });

      describe('lockCollection', () => {
        it('should only can lock if you are logged in', () => {
          const methodInvocation = {};
          const args = {
            username: curUser.username,
            collId: curColl._id,
            collName: curColl.name,
            privateStatus: curColl.private,
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
            privateStatus: curColl.private,
          };
          lockCollection._execute(methodInvocation, args);
          expect(Collections.findOne(curColl._id).private).to.be.true;

          const coll = Collections.findOne(curColl._id);
          const newArgs = {
            username: curUser.username,
            collId: coll._id,
            collName: coll.name,
            privateStatus: coll.private,
          };
          lockCollection._execute(methodInvocation, newArgs);
          expect(Collections.findOne(curColl._id).private).to.be.false;
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