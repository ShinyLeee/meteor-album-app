import { Accounts } from 'meteor/accounts-base';
import { defaultUserProfile } from '../user.js';

Accounts.onCreateUser((options, user) => {
  let curUser = user;
  curUser.profile = defaultUserProfile;
  curUser.profile.nickname = user.username; // make nickname pre set
  curUser.createdAt = new Date();
  curUser = Object.assign({}, curUser);
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
