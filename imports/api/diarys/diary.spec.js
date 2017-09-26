/* eslint-disable no-unused-expressions */
import _ from 'lodash';
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { limitStrLength } from '/imports/utils';
import { insertDiary, updateDiary, removeDiary } from './methods.js';
import { Users } from '../users/user.js';
import { Diarys } from './diary.js';

const deltaObj = {
  ops: [
    { insert: 'Test' },
  ],
};

Factory.define('diary', Diarys, {
  user: () => limitStrLength(faker.internet.userName(), 20),
  title: () => limitStrLength(faker.hacker.noun(), 20),
  outline: () => faker.hacker.noun(),
  content: deltaObj,
  createdAt: () => new Date(),
  updatedAt: () => new Date(),
});

if (Meteor.isServer) {
  import './server/publications.js';

  describe('DIARYS API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const diary = Factory.create('diary');
        assert.typeOf(diary.user, 'string', 'user field must unique username');
        assert.typeOf(diary.title, 'string');
        assert.typeOf(diary.outline, 'string');
        assert.typeOf(diary.content, 'object'); // must be a Delta instance
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
            outline: curDiary.outline,
            content: curDiary.content,
          };
          assert.throws(() => {
            updateDiary._execute({}, args);
          }, Meteor.Error, /api.diarys.update.notLoggedIn/);
        });

        it('should update diary document after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const newOutline = 'After Update';
          const newContent = { ops: [{ insert: 'Update' }] };
          const args = {
            diaryId: curDiary._id,
            outline: newOutline,
            content: newContent,
          };

          updateDiary._execute(methodInvocation, args);

          const updatedDiary = Diarys.findOne({ _id: curDiary._id });
          expect(updatedDiary.outline).to.equal(newOutline);
          expect(updatedDiary.content).to.eql(newContent);
          expect(updatedDiary.updatedAt).to.not.equal(curDiary.updatedAt);
        });
      });

      describe('removeDiary', () => {
        it('should only can remove if you are logged in', () => {
          const args = {
            diaryId: curDiary._id,
          };
          assert.throws(() => {
            removeDiary._execute({}, args);
          }, Meteor.Error, /api.diarys.remove.notLoggedIn/);
        });

        it('should remove diary document after method call', () => {
          const methodInvocation = { userId: curUser._id };
          const args = { diaryId: curDiary._id };

          expect(Diarys.find({ _id: curDiary._id }).count()).to.equal(1);
          removeDiary._execute(methodInvocation, args);

          expect(Diarys.findOne({ _id: curDiary._id })).to.be.undefined;
        });
      });
    });
  });
}
