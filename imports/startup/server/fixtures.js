import qiniu from 'qiniu';
import { Meteor } from 'meteor/meteor';
import { Codes } from '/imports/api/codes/code.js';

Meteor.startup(() => {
  // We need to set ACCESS_KEY & SECRET_KEY in Advance
  qiniu.conf.ACCESS_KEY = Meteor.settings.private.qiniu.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = Meteor.settings.private.qiniu.SECRET_KEY;

  if (Codes.find().count() === 0) {
    Codes.insert({ no: '59920944', isUsed: false });
    Codes.insert({ no: '94420599', isUsed: false });
    Codes.insert({ no: '15967425826', isUsed: false });
    Codes.insert({ no: '13429373356', isUsed: false });
  }
});
