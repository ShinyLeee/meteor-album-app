import { Meteor } from 'meteor/meteor';

export const requireAuth = (nextState, replace) => {
  // Only When User is loggingIn or has logined return true
  if (Meteor.loggingIn() || Meteor.user()) {
    return true;
  }
  return replace({
    pathname: '/login',
    state: { nextPathname: nextState.location.pathname },
  });
};

export const isLogin = (nextState, replace) => {
  if (Meteor.loggingIn() || Meteor.user()) {
    return replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  }
  return false;
};
