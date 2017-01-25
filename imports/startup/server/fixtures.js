import qiniu from 'qiniu';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Codes } from '/imports/api/codes/code.js';

Meteor.startup(() => {
  // We need to set ACCESS_KEY & SECRET_KEY in Advance
  qiniu.conf.ACCESS_KEY = Meteor.settings.private.qiniu.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = Meteor.settings.private.qiniu.SECRET_KEY;

  Codes.remove({});
  if (Codes.find().count() === 0) {
    Codes.insert({ no: '59920944', isUsed: true, createdAt: new Date() });
    Codes.insert({ no: '94420599', isUsed: true, createdAt: new Date() });
    for (let i = 0; i < 10; i++) {
      Codes.insert({ no: `gp_${Random.id()}`, createdAt: new Date() });
    }
  }
});
