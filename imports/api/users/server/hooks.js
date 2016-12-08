import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let curUser = user;
  curUser.profile = {
    nickname: '',
    cover: 'http://odsiu8xnd.bkt.clouddn.com/default-cover.jpg',
    avatar: 'http://odsiu8xnd.bkt.clouddn.com/default-large.jpg',
    relater: null,
    settings: {
      notification: true,
      message: true,
    },
  };
  curUser = Object.assign({}, curUser, options.profile);
  return curUser;
});

// Validate username, sending a specific error message on failure.
// Accounts.validateNewUser((user) => {
//   if (user.username && user.username.length >= 6 && user.username.length <= 20) {
//     return true;
//   }
//   throw new Meteor.Error(403, 'Username length must in 6~20');
// });

// Validate login attempts.
Accounts.validateLoginAttempt((attempt) => {
  if (!attempt.allowed) {
    return false;
  }
  return true;
});
