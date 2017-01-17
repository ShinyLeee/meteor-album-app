import { Meteor } from 'meteor/meteor';

// If not login redirect location to /login
export const isLogin = (nextState, replace, done) => {
  Meteor.callPromise('Auth.isLogin')
  .then((login) => {
    if (!login) replace({ pathname: '/login' });
    done();
  })
  .catch((err) => {
    replace({ pathname: `/${err.error}` });
    done();
    console.log(err); // eslint-disable-line
  });
};

// If has login, redirect to index page
export const isLogout = (nextState, replace, done) => {
  Meteor.callPromise('Auth.isLogin')
  .then((login) => {
    if (login) replace({ pathname: '/' });
    done();
  })
  .catch((err) => {
    replace({ pathname: `/${err.error}` });
    done();
    console.log(err); // eslint-disable-line
  });
};

export const isPermission = (nextState, replace, done) => {
  const { params } = nextState;
  Meteor.callPromise('Auth.isPermission', { username: params.username })
  .then((isPermit) => {
    if (!isPermit) replace({ pathname: '/404' });
    done();
  })
  .catch((err) => {
    replace({ pathname: `/${err.error}` });
    done();
    console.log(err); // eslint-disable-line
  });
};

// Check is this user permit other visit home page TODO FIX USER NOT FOUND ERROR
export const isAllowVisitHome = (nextState, replace, done) => {
  const { params } = nextState;
  Meteor.callPromise('Auth.isAllowVisitHome', { username: params.username })
  .then((allowVisitHome) => {
    if (!allowVisitHome) replace({ pathname: '/403', state: { message: '该用户不允许他人访问其主页' } });
    done();
  })
  .catch((err) => {
    replace({ pathname: `/${err.error}` });
    done();
    console.log(err); // eslint-disable-line
  });
};

// Check is this user permit other visit this specific collection
export const isAllowVisitColl = (nextState, replace, done) => {
  const { params } = nextState;
  Meteor.callPromise('Auth.isAllowVisitColl', { username: params.username })
  .then((allowVisitColl) => {
    if (!allowVisitColl) replace({ pathname: '/403', state: { message: '该用户不允许他人访问其相册' } });
    done();
  })
  .catch((err) => {
    replace({ pathname: `/${err.error}` });
    done();
    console.log(err); // eslint-disable-line
  });
};
