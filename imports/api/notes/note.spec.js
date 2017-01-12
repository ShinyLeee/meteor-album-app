/* eslint-disable no-unused-expressions */
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { insertNote, readAllNotes, readNote } from './methods.js';
import { Users } from '../users/user.js';
import { Notes } from './note.js';

if (Meteor.isServer) {
  import './server/publications.js';

  describe('NOTES API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const note = Factory.create('note');
        assert.typeOf(note.title, 'string');
        assert.typeOf(note.content, 'string');
        assert.typeOf(note.sender, 'string', 'sender field must unique username');
        assert.typeOf(note.receiver, 'string', 'receiver field must unique username');
        assert.typeOf(note.sendAt, 'date');
        assert.typeOf(note.createdAt, 'date');
      });
    });

    describe('publication', () => {
      let curUser;
      before(() => {
        Users.remove({});
        Notes.remove({});

        curUser = Factory.create('user');

        // Create 2 notes send to current user
        _.times(2, () => Factory.create('note', { receiver: curUser.username }));

        // Create 1 note send to another user
        Factory.create('note', { receiver: 'tester' });
      });

      describe('Notes.own', () => {
        it('should only send current user\'s notes documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Notes.own', curUser.username, (collections) => {
            expect(collections.notes).to.have.length(2);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let curUser;
      let curNote;

      beforeEach(() => {
        // Clear
        Users.remove({});
        Notes.remove({});

        // Create a user in that list
        curUser = Factory.create('user');
        curNote = Factory.create('note', { receiver: curUser.username });
        Factory.create('note', { receiver: curUser.username });
      });

      describe('insertNote', () => {
        it('should only can insert if you are logged in', () => {
          const args = Factory.tree('note');
          assert.throws(() => {
            insertNote._execute({}, args);
          }, Meteor.Error, /api.notes.insert.notLoggedIn/);
        });

        it('should insert note after method call', () => {
          expect(Notes.find({ receiver: curUser.username }).count()).to.equal(2);

          const methodInvocation = { userId: curUser._id };
          const args = Factory.tree('note', { receiver: curUser.username });

          insertNote._execute(methodInvocation, args);
          expect(Notes.find({ receiver: curUser.username }).count()).to.equal(3);
        });
      });

      describe('readAllNotes', () => {
        it('should only can work if you are logged in', () => {
          assert.throws(() => {
            readAllNotes._execute({}, { receiver: curUser.username });
          }, Meteor.Error, /api.notes.readAll.notLoggedIn/);
        });

        it('should set isRead field to true after method call', () => {
          expect(Notes.find({ receiver: curUser.username, isRead: false }).count()).to.equal(2);

          const methodInvocation = { userId: curUser._id };
          const args = { receiver: curUser.username };

          readAllNotes._execute(methodInvocation, args);
          expect(Notes.find({ receiver: curUser.username, isRead: false }).count()).to.equal(0);
        });
      });

      describe('readNote', () => {
        it('should only can work if you are logged in', () => {
          assert.throws(() => {
            readNote._execute({}, { noteId: curNote._id });
          }, Meteor.Error, /api.notes.read.notLoggedIn/);
        });

        it('should set isRead field to true after method call', () => {
          expect(Notes.findOne(curNote._id).isRead).to.be.false;

          const methodInvocation = { userId: curUser._id };
          const args = { noteId: curNote._id };

          readNote._execute(methodInvocation, args);
          expect(Notes.findOne(curNote._id).isRead).to.be.true;
        });
      });
    });
  });
}