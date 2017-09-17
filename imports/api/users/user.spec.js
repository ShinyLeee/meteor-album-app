import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { limitStrLength } from '/imports/utils/utils.js';
import { updateProfile, followUser, unFollowUser } from './methods.js';
import { Users, defaultUserProfile } from './user.js';

Factory.define('user', Users, {
  username: () => limitStrLength(faker.internet.userName(), 20),
  profile: () => defaultUserProfile,
  createdAt: () => new Date(),
});

const sourceDomain = Meteor.settings.public.sourceDomain;

if (Meteor.isServer) {
  import './server/publications.js';

  describe('USERS API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const user = Factory.create('user');
        assert.typeOf(user.username, 'string', 'username field must be String');
        assert.typeOf(user.profile.followers, 'array', 'profile.followers must be array');
        assert.typeOf(user.profile.settings, 'object', 'profile.settings must be object');
        assert.typeOf(user.createdAt, 'date');
      });
    });

    describe('publication', () => {
      let curUser;
      before(() => {
        Users.remove({});

        curUser = Factory.create('user');
        _.times(3, () => Factory.create('user'));
      });

      describe('Users.all', () => {
        it('should send all user documents', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Users.all', (collections) => {
            expect(collections.users).to.have.length(4);
            done();
          });
        });

        it('should only reveal username and profile fields to client', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Users.all', (collections) => {
            expect(collections.users[0]).to.have.all.keys(['_id', 'username', 'profile']);
            done();
          });
        });
      });

      describe('Users.others', () => {
        it('should send user documents except own', (done) => {
          const collector = new PublicationCollector({ userId: curUser._id });
          collector.collect('Users.others', (collections) => {
            expect(collections.users).to.have.length(3);
            done();
          });
        });
      });

      describe('Users.limit', () => {
        it('should send specific number user documents', (done) => {
          const collector = new PublicationCollector();
          collector.collect('Users.limit', 2, (collections) => {
            expect(collections.users).to.have.length(2);
            done();
          });
        });
      });
    });


    describe('methods', () => {
      let curUser;

      beforeEach(() => {
        // Clear
        Users.remove({});

        // Create a user in that list
        curUser = Factory.create('user');
      });

      describe('updateProfile', () => {
        it('should only can update if you are logged in', () => {
          const methodInvocation = {};
          const args = {};

          assert.throws(() => {
            updateProfile._execute(methodInvocation, args);
          }, Meteor.Error, /api.users.updateProfile.notLoggedIn/);
        });

        it('should update profile after method call', () => {
          // Set up method context and arguments
          const methodInvocation = { userId: curUser._id };
          const prevProfile = Users.findOne(curUser._id).profile;
          const args = {
            nickname: 'test',
            intro: 'intro after update',
            avatar: `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`,
            cover: `${sourceDomain}/GalleryPlus/Default/default-cover.jpg`,
            settings: { allowNoti: false, allowMsg: false, allowVisitHome: false, allowVisitColl: false },
          };

          updateProfile._execute(methodInvocation, args);

          const currProfile = Users.findOne(curUser._id).profile;
          // profile has other properties, for instance: [followers]
          const expectedProfile = Object.assign({}, prevProfile, args);
          expect(currProfile).to.be.eql(expectedProfile);
        });
      });

      describe('followUser', () => {
        it('should only work if you are logged in and the target is not yourself', () => {
          const args = { targetId: curUser._id, targetName: curUser.username };

          assert.throws(() => {
            followUser._execute({}, args);
          }, Meteor.Error, /api.users.followUser.notLoggedIn/);

          assert.throws(() => {
            followUser._execute({ userId: curUser._id }, args);
          }, Meteor.Error, /api.users.followUser.targetDenied/);
        });

        it('should add profile.followers after method call', () => {
          // create a target User
          const target = Factory.create('user');

          const methodInvocation = { userId: curUser._id };
          const args = { targetId: target._id, targetName: target.username };

          followUser._execute(methodInvocation, args);

          const targetUser = Users.findOne(target._id);
          expect(targetUser.profile.followers).to.include(curUser.username);

          const currentUser = Users.findOne(curUser._id);
          expect(currentUser.profile.following).to.include(targetUser.username);
        });
      });

      describe('unFollowUser', () => {
        it('should only work if you are logged in and the target is not yourself', () => {
          const args = { targetId: curUser._id, targetName: curUser.username };

          assert.throws(() => {
            unFollowUser._execute({}, args);
          }, Meteor.Error, /api.users.unFollowUser.notLoggedIn/);

          assert.throws(() => {
            unFollowUser._execute({ userId: curUser._id }, args);
          }, Meteor.Error, /api.users.unFollowUser.targetDenied/);
        });

        it('should add profile.followers after method call', () => {
          // we need create a User that profile has followers [userId]
          const profile = Object.assign({}, defaultUserProfile, { followers: [curUser.username] });
          const target = Factory.create('user', { profile });

          const methodInvocation = { userId: curUser._id };
          const args = { targetId: target._id, targetName: target.username };

          unFollowUser._execute(methodInvocation, args);

          const targetUser = Users.findOne(target._id);
          expect(targetUser.profile.followers).to.not.include(curUser.username);

          const currentUser = Users.findOne(curUser._id);
          expect(currentUser.profile.following).to.not.include(targetUser.username);
        });
      });
    });
  });
}
