import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import store from '/imports/ui/store.js';
import { userCreate } from '/imports/ui/actions/actionTypes.js';

Accounts.onCreateUser((options, user) => {
  let curUser = user;
  curUser.profile = {
    likes: 0,
    images: 0,
    notes: 0,
    collections: 0,
    relater: null,
    avatar: 'http://odsiu8xnd.bkt.clouddn.com/vivian/extra-large.jpg',
  };
  curUser = Object.assign({}, curUser, options.profile);
  store.dispatch(userCreate(Object.assign({}, curUser, { time: new Date() })));
  return curUser;
});

// Validate username, sending a specific error message on failure.
Accounts.validateNewUser((user) => {
  if (user.username && user.username.length >= 6 && user.username.length <= 20) {
    return true;
  }
  throw new Meteor.Error(403, 'Username length must in 6~20');
});

// Validate login attempts.
Accounts.validateLoginAttempt((attempt) => {
  if (!attempt.allowed) {
    return false;
  }
  return true;
});
