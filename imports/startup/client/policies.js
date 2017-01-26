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


// 当前浏览站点是否属于自己
// 如果不是则返回404页面
export const isOwner = (nextState, replace, done) => {
  const { params } = nextState;
  Meteor.callPromise('Auth.isOwner', { username: params.username })
  .then((isOwn) => {
    if (!isOwn) replace({ pathname: '/404' });
    done();
  })
  .catch((err) => {
    replace({ pathname: `/${err.error}` });
    done();
    console.log(err); // eslint-disable-line
  });
};

// 检查当前用户是否允许他人访问其主页
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

// 检查当前用户是否允许他人访问其相册，如果不允许泽访问403页面
// 如果存在:cname参数，则另检查当前访问的相册是否加密，如果加密则返回404页面
export const isAllowVisitColl = (nextState, replace, done) => {
  const { params } = nextState;
  Meteor.callPromise('Auth.isAllowVisitColl', { username: params.username, cname: params.cname })
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
