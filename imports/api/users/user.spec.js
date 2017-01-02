import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
// import { PublicationCollector } from 'meteor/publication-collector';
import { chai, assert, expect } from 'meteor/practicalmeteor:chai';
// import { Random } from 'meteor/random';
// import { _ } from 'meteor/underscore';
import { Users } from './user.js';

if (Meteor.isServer) {
  import './server/publications.js';

  describe('user API', () => {
    describe('mutators', () => {
      it('should builds correctly from factory', () => {
        const user = Factory.create('user');
        expect(user).to.be.an('object');
        expect(user.profile).to.be.an('object');
        expect(user.createdAt).to.be.an.instanceof(Date);
      });
    });
  });
}
