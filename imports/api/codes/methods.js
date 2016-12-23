import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { Codes } from './code.js';

export const checkCode = new ValidatedMethod({
  name: 'codes.checkCode',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    codeNo: { type: String },
  }).validator({ clean: true, filter: false }),
  run({ codeNo }) {
    if (this.userId) {
      throw new Meteor.Error(403, 'Access Denied');
    }
    const isExist = Codes.findOne({ no: codeNo, isUsed: false });
    return isExist;
  },
});

export const useCode = new ValidatedMethod({
  name: 'codes.useCode',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    codeNo: { type: String },
  }).validator({ clean: true, filter: false }),
  run({ codeNo }) {
    if (this.userId) {
      throw new Meteor.Error(403, 'Access Denied');
    }
    Codes.update({ no: codeNo, isUsed: false }, { $set: { isUsed: true } });
  },
});
