import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let curUser = user;
  curUser.profile = {
    nickname: '',
    avatar: 'http://odsiu8xnd.bkt.clouddn.com/default-avatar.jpg',
    cover: 'http://odsiu8xnd.bkt.clouddn.com/default-cover.jpg',
    relater: null,
    settings: {
      allowNoti: true,
      allowMsg: true,
      allowVisitHome: true,
      allowVisitColl: true,
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
