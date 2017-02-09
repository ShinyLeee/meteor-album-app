/* eslint-disable no-unused-expressions */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { insertDiary, updateDiary } from './methods.js';
import { Users } from '../users/user.js';
import { Diarys } from './diary.js';

if (Meteor.isServer) {
  import './server/publications.js';

  describe('DIARYS API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const diary = Factory.create('diary');
        assert.typeOf(diary.user, 'string', 'user field must unique username');
        assert.typeOf(diary.title, 'string');
        assert.typeOf(diary.content, 'string');
        assert.typeOf(diary.createdAt, 'date');
        assert.typeOf(diary.updatedAt, 'date');
      });
    });

    describe('publication', () => {
      let curUser;
      before(() => {
        Users.remove({});
        Diarys.remove({});

        curUser = Factory.create('user');

        Factory.create('diary');

        // Create 2 diarys belong to current user
        _.times(2, () => Factory.create('diary', { user: curUser.username }));
      });

      describe('Diarys.own', () => {
        it('should only send own diarys documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Diarys.own', (collections) => {
            expect(collections.diarys).to.have.length(2);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let curUser;
      let curDiary;

      beforeEach(() => {
        // Clear
        Users.remove({});
        Diarys.remove({});

        // Create a user in that list
        curUser = Factory.create('user');
        curDiary = Factory.create('diary', { user: curUser.username });
      });

      describe('insertDiary', () => {
        it('should only can insert if you are logged in', () => {
          const args = Factory.tree('diary');
          assert.throws(() => {
            insertDiary._execute({}, args);
          }, Meteor.Error, /api.diarys.insert.notLoggedIn/);
        });

        it('should insert diary after method call', () => {
          expect(Diarys.find({ user: curUser.username }).count()).to.equal(1);

          const methodInvocation = { userId: curUser._id };
          const args = Factory.tree('diary', { user: curUser.username });

          insertDiary._execute(methodInvocation, args);
          expect(Diarys.find({ user: curUser.username }).count()).to.equal(2);
        });
      });

      describe('updateDiary', () => {
        it('should only can update if you are logged in', () => {
          const args = {
            diaryId: curDiary._id,
            title: curDiary.title,
            content: curDiary.content,
          };
          assert.throws(() => {
            updateDiary._execute({}, args);
          }, Meteor.Error, /api.diarys.update.notLoggedIn/);
        });

        it('should update diary document after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const newTitle = 'update-title';
          const newContent = 'update-content';
          const args = {
            diaryId: curDiary._id,
            title: newTitle,
            content: newContent,
          };

          updateDiary._execute(methodInvocation, args);

          const updatedDiary = Diarys.findOne({ _id: curDiary._id });
          expect(updatedDiary.title).to.equal(newTitle);
          expect(updatedDiary.content).to.equal(newContent);
          expect(updatedDiary.updatedAt).to.not.equal(curDiary.updatedAt);
        });
      });
    });
  });
}
