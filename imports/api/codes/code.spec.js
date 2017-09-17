/* eslint-disable no-unused-expressions */
import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { checkCode, useCode } from './methods.js';
import { Codes } from './code.js';

Factory.define('code', Codes, {
  no: () => faker.random.number(),
  createdAt: () => new Date(),
});

if (Meteor.isServer) {
  describe('CODES API', () => {
    describe('factory', () => {
      it('should builds correctly from factory', () => {
        const codes = Factory.create('code');
        assert.typeOf(codes.no, 'string');
        assert.typeOf(codes.isUsed, 'boolean');
        assert.typeOf(codes.createdAt, 'date');
      });
    });

    describe('methods', () => {
      let curCode;
      beforeEach(() => {
        Codes.remove({});
        curCode = Factory.create('code');
      });

      describe('checkCode', () => {
        it('should only work if you are not logged in', () => {
          const methodInvocation = { userId: Random.id() };
          const args = { codeNo: curCode.no };
          assert.throws(() => {
            checkCode._execute(methodInvocation, args);
          }, Meteor.Error, /api.codes.check.hasLoggedIn/);
        });
      });

      describe('useCode', () => {
        it('should only work if you are not logged in', () => {
          const methodInvocation = { userId: Random.id() };
          const args = { codeNo: curCode.no };
          assert.throws(() => {
            useCode._execute(methodInvocation, args);
          }, Meteor.Error, /api.codes.use.hasLoggedIn/);
        });

        it('should update isUsed and usedAt field after method call', () => {
          const methodInvocation = {};
          const args = { codeNo: curCode.no };
          expect(curCode.isUsed).to.be.false;
          expect(curCode.usedAt).to.be.undefined;

          useCode._execute(methodInvocation, args);
          const updatedCode = Codes.findOne(curCode._id);
          expect(updatedCode.isUsed).to.be.true;
          expect(updatedCode.usedAt).to.be.instanceof(Date);
        });
      });
    });
  });
}
