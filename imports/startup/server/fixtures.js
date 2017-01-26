import qiniu from 'qiniu';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // We need to set ACCESS_KEY & SECRET_KEY in Advance
  qiniu.conf.ACCESS_KEY = Meteor.settings.private.qiniu.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = Meteor.settings.private.qiniu.SECRET_KEY;
});
