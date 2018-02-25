import { Meteor } from 'meteor/meteor';

export const isLogin = async ({ location }) => {
  const ret = await Meteor.callPromise('Auth.isLogin');
  return {
    isAuthenticated: ret,
    state: ret
      ? null
      : {
        from: location.pathname,
        redirect: '/login',
        message: '您还尚未登录',
      },
  };
};

export const isLogout = async ({ location }) => {
  const ret = await Meteor.callPromise('Auth.isLogin');
  return {
    isAuthenticated: !ret,
    state: !ret
      ? null
      : {
        from: location.pathname,
        redirect: '/',
        message: '您已登录',
      },
  };
};

export const isOwner = async ({ location, computedMatch: { params } }) => {
  const ret = await Meteor.callPromise('Auth.isOwner', {
    username: params.username,
  });
  return {
    isAuthenticated: ret,
    state: ret
      ? null
      : {
        from: location.pathname,
        redirect: '/403',
        message: '该页面不存在',
      },
  };
};

export const isAllowVisitHome = async ({ location, computedMatch: { params } }) => {
  try {
    const ret = await Meteor.callPromise('Auth.isAllowVisitHome', {
      username: params.username,
    });
    return {
      isAuthenticated: ret,
      state: ret
        ? null
        : {
          from: location.pathname,
          redirect: '/403',
          message: '该用户不允许他人访问',
        },
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      state: {
        from: location.pathname,
        redirect: `/${err.error}`,
        message: err.error,
      },
    };
  }
};

export const isAllowVisitColl = async ({ location, computedMatch: { params } }) => {
  try {
    const ret = await Meteor.callPromise('Auth.isAllowVisitColl', {
      username: params.username,
      cname: params.cname,
    });
    return {
      isAuthenticated: ret,
      state: ret
        ? null
        : {
          from: location.pathname,
          redirect: '/403',
          message: '该用户不允许他人访问',
        },
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      state: {
        from: location.pathname,
        redirect: `/${err.error}`,
        message: err.error,
      },
    };
  }
};
