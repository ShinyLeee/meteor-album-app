/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { limitStrLength } from '/imports/utils';
import { insertComment, removeComment } from './methods';
import { Users } from '../users/user';
import { Comments } from './comment';

Factory.define('comment', Comments, {
  user: () => limitStrLength(faker.internet.userName(), 20),
  discussion_id: () => Random.id(),
  content: () => limitStrLength(faker.lorem.sentence(), 20),
  createdAt: () => new Date(),
});

if (Meteor.isServer) {
  import './server/publications';

  describe('COMMENTS API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const comment = Factory.create('comment');
        assert.typeOf(comment.user, 'string', 'user field must unique username');
        // TODO give id specific regex
        assert.typeOf(comment.discussion_id, 'string', 'discussion_id field must be a valid id');
        assert.typeOf(comment.type, 'string', 'type must be image / collection or note');
        assert.typeOf(comment.content, 'string', 'type must valid string less than 56');
        assert.typeOf(comment.createdAt, 'date');
      });
    });

    describe('publication', () => {
      let curUser;
      const imageId = Random.id();
      before(() => {
        Users.remove({});
        Comments.remove({});

        curUser = Factory.create('user');

        // Create 2 comments belong to current user
        _.times(2, () => Factory.create('comment', { user: curUser.username }));

        // Create a default comment
        Factory.create('comment', { discussion_id: imageId, type: 'image' });
      });

      describe('Comments.own', () => {
        it('should send all own comment documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Comments.own', (collections) => {
            expect(collections.comments).to.have.length(2);
            done();
          });
        });
      });

      describe('Comments.inImage', () => {
        it('should send specific user\'s public collection documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Comments.inImage', imageId, (collections) => {
            expect(collections.comments).to.have.length(1);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let curUser;
      let curComment;

      beforeEach(() => {
        // Clear
        Users.remove({});
        Comments.remove({});

        curUser = Factory.create('user');
        curComment = Factory.create('comment', { user: curUser.username });
      });

      describe('insertComment', () => {
        it('should only can insert if you are logged in', () => {
          const newComment = Factory.tree('comment');
          assert.throws(() => {
            insertComment._execute({}, newComment);
          }, Meteor.Error, /api.comments.insert.notLoggedIn/);
        });

        it('should insert comment after method call', () => {
          expect(Comments.find({ user: curUser.username }).count()).to.equal(1);

          const methodInvocation = { userId: curUser._id };
          const args = Factory.tree('comment', { user: curUser.username });

          insertComment._execute(methodInvocation, args);
          expect(Comments.find({ user: curUser.username }).count()).to.equal(2);
        });
      });

      describe('removeComment', () => {
        it('should only can remove if you are logged in', () => {
          assert.throws(() => {
            removeComment._execute({}, { commentId: curComment._id });
          }, Meteor.Error, /api.comments.remove.notLoggedIn/);
        });

        it('should remove comment after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const args = { commentId: curComment._id };

          expect(Comments.find({ user: curUser.username }).count()).to.equal(1);

          removeComment._execute(methodInvocation, args);
          expect(Comments.find({ user: curUser.username }).count()).to.equal(0);
        });
      });
    });
  });
}
