import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  let curUser = user;
  const sourceDomain = Meteor.settings.public.source;
  curUser.profile = {
    nickname: '',
    intro: '',
    avatar: `${sourceDomain}/GalleryPlus/Default/default-avatar.jpg`,
    cover: `${sourceDomain}/GalleryPlus/Default/default-cover.jpg`,
    followers: [],
    settings: {
      allowNoti: true,
      allowMsg: true,
      allowVisitHome: true,
      allowVisitColl: true,
    },
  };
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
