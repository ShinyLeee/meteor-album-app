import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Collections } from '/imports/api/collections/collection';

export const isLogin = ({ User, location }) => {
  let ret = {
    isAuthenticated: !!User,
  };
  if (!ret.isAuthenticated) {
    ret = Object.assign({}, ret, {
      redirect: '/login',
      state: {
        referrer: location.pathname,
        message: '您还尚未登录',
      },
    });
  }
  return ret;
};

export const isLogout = ({ User, location }) => {
  let ret = {
    isAuthenticated: !User,
  };
  if (!ret.isAuthenticated) {
    ret = Object.assign({}, ret, {
      redirect: '/',
      state: {
        referrer: location.pathname,
        message: '您已成功登录',
      },
    });
  }
  return ret;
};

export const isOwner = ({ User, location, computedMatch: { params } }) => {
  let ret = {
    isAuthenticated: !!User && User.username === params.username,
  };
  if (!ret.isAuthenticated) {
    ret = Object.assign({}, ret, {
      redirect: '/403',
      state: {
        referrer: location.pathname,
        message: '您没有权限访问此页面',
      },
    });
  }
  return ret;
};

/**
 * @desc 检测当前用户页面是否允许访问
 *
 * 1. 用户不存在: 不允许访问并跳转至404页面
 * 2. 用户存在且用户访问自己的主页或当前用户允许他人访问: 允许访问
 * 3. 用户存在且用户访问他人主页且他人主页不允许被访问: 不允许访问并跳转至403页面
 */
export const isAllowVisitHome = ({ User, location, computedMatch: { params } }) => {
  const curUser = Meteor.users.findOne({ username: params.username });
  const isUserExist = !!curUser;
  const isUserOwner = _.get(User, 'username') === _.get(curUser, 'username');

  let ret = {
    isAuthenticated: isUserExist && (isUserOwner || _.get(curUser, 'profile.settings.allowVisitHome')),
  };
  if (!ret.isAuthenticated) {
    ret = Object.assign({}, ret, {
      redirect: isUserExist ? '/403' : '/404',
      state: {
        referrer: location.pathname,
        message: isUserExist ? '该用户不允许他人访问' : '该用户不存在',
      },
    });
  }
  return ret;
};

/**
 * @desc 检测当前用户的所有相册是否允许访问
 *
 * 1. 用户不存在: 不允许访问并跳转至404页面
 * 2. 用户存在且用户访问自己的所有相册页面或该用户允许他人访问其相册: 允许访问
 * 3. 用户存在且用户访问他人的所有相册页面且该用户不允许他人访问: 不允许访问并跳转至403页面
 */
export const isAllowVisitAllColl = ({ User, location, computedMatch: { params } }) => {
  const curUser = Meteor.users.findOne({ username: params.username });
  const isUserExist = !!curUser;
  if (!isUserExist) {
    return {
      isAuthenticated: false,
      redirect: '/404',
      state: {
        referrer: location.pathname,
        message: '该页面不存在',
      },
    };
  } else if (
    _.get(User, 'username') === _.get(curUser, 'username') ||
    _.get(curUser, 'profile.settings.allowVisitColl')
  ) {
    return {
      isAuthenticated: true,
    };
  }
  return {
    isAuthenticated: false,
    redirect: '/403',
    state: {
      referrer: location.pathname,
      message: '该用户不允许他人访问其相册',
    },
  };
};

/**
 * @desc 检测当前用户的所有相册是否允许访问
 *
 * 1. 用户不存在: 不允许访问并跳转至404页面
 * 2. 用户存在且用户访问自己的相册页面或该用户允许他人访问其所有相册且当前相册为公开相册: 允许访问
 * 3. 用户存在且用户访问他人的相册页面且该用户不允许他人访问: 不允许访问并跳转至403页面
 */
export const isAllowVisitSpecColl = ({ User, location, computedMatch: { params } }) => {
  const curUser = Meteor.users.findOne({ username: params.username });
  const curColl = Collections.findOne({ name: params.cname });
  const isExist = !!curUser && !!curColl;
  if (!isExist) {
    return {
      isAuthenticated: false,
      redirect: '/404',
      state: {
        referrer: location.pathname,
        message: '该页面不存在',
      },
    };
  } else if (
    _.get(User, 'username') === _.get(curUser, 'username') ||
    (_.get(curUser, 'profile.settings.allowVisitColl') && !_.get(curColl, 'private'))
  ) {
    return {
      isAuthenticated: true,
    };
  }
  return {
    isAuthenticated: false,
    redirect: '/403',
    state: {
      referrer: location.pathname,
      message: '该用户不允许他人访问该相册',
    },
  };
};
