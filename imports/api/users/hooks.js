import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import store from '/imports/ui/store.js';
import { userLogin, userLogout } from '/imports/ui/actions/actionTypes.js';

Accounts.onLogin(() => {
  let user = Meteor.user();
  user = Object.assign({}, user, { time: new Date() });
  store.dispatch(userLogin(user));
});

Accounts.onLogout(() => {
  const user = {
    uid: Meteor.userId(),
    time: new Date(),
  };
  store.dispatch(userLogout(user));
});
