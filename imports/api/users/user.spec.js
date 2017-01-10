import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { createUser, updateProfile, followUser, unFollowUser } from './methods.js';
import { Users, defaultUserProfile } from './user.js';

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
      let userId;
      before(() => {
        Users.remove({});

        userId = Factory.create('user')._id;
        _.times(3, () => Factory.create('user'));
      });

      describe('Users.all', () => {
        it('should send all user documents', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('Users.all', (collections) => {
            expect(collections.users).to.have.length(4);
            done();
          });
        });

        it('should only reveal username and profile fields to client', (done) => {
          const collector = new PublicationCollector({ userId });
          collector.collect('Users.all', (collections) => {
            expect(collections.users[0]).to.have.all.keys(['_id', 'username', 'profile']);
            done();
          });
        });
      });
    });

    describe('methods', () => {
      let userId;

      beforeEach(() => {
        // Clear
        Users.remove({});

        // Create a user in that list
        userId = Factory.create('user')._id;
      });

      describe('createUser', () => {
        it('should only can create if you are not logged in', () => {
          // Set up method context and arguments
          const methodInvocation = { userId };
          const args = { username: 'test', password: 'test' };

          assert.throws(() => {
            createUser._execute(methodInvocation, args);
          }, Meteor.Error, /api.users.createUser.hasLoggedIn/);
        });
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
          const methodInvocation = { userId };
          const prevProfile = Users.findOne(userId).profile;
          const args = {
            nickname: 'test',
            intro: 'intro after update',
            avatar: `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`,
            cover: `${sourceDomain}/GalleryPlus/Default/default-cover.jpg`,
            settings: { allowNoti: false, allowMsg: false, allowVisitHome: false, allowVisitColl: false },
          };

          updateProfile._execute(methodInvocation, args);

          const currProfile = Users.findOne(userId).profile;
          // profile has other properties, for instance: [followers]
          const expectedProfile = Object.assign({}, prevProfile, args);
          expect(currProfile).to.be.eql(expectedProfile);
        });
      });

      describe('followUser', () => {
        it('should only work if you are logged in and the target is not yourself', () => {
          const args = { target: userId };

          assert.throws(() => {
            followUser._execute({}, args);
          }, Meteor.Error, /api.users.followUser.notLoggedIn/);

          assert.throws(() => {
            followUser._execute({ userId }, args);
          }, Meteor.Error, /api.users.followUser.targetDenied/);
        });

        it('should add profile.followers after method call', () => {
          // create a target User
          const target = Factory.create('user')._id;

          const methodInvocation = { userId };
          const args = { target };

          followUser._execute(methodInvocation, args);

          const targetUserFollowers = Users.findOne(target).profile.followers;
          expect(targetUserFollowers).to.include(userId);
        });
      });

      describe('unFollowUser', () => {
        it('should only work if you are logged in and the target is not yourself', () => {
          const args = { target: userId };

          assert.throws(() => {
            unFollowUser._execute({}, args);
          }, Meteor.Error, /api.users.unFollowUser.notLoggedIn/);

          assert.throws(() => {
            unFollowUser._execute({ userId }, args);
          }, Meteor.Error, /api.users.unFollowUser.targetDenied/);
        });

        it('should add profile.followers after method call', () => {
          // we need create a User that profile has followers [userId]
          const profile = Object.assign({}, defaultUserProfile, { followers: [userId] });
          const target = Factory.create('user', { profile })._id;

          const methodInvocation = { userId };
          const args = { target };

          unFollowUser._execute(methodInvocation, args);

          const targetUserFollowers = Users.findOne(target).profile.followers;
          expect(targetUserFollowers).to.not.include(userId);
        });
      });
    });
  });
}
