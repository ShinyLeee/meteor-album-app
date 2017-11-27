import { Meteor } from 'meteor/meteor';
import { replace } from 'react-router-redux';
import * as types from '../constants/ActionTypes';

export const loadingData = () => ({
  type: types.LOADING_DATA,
});

export const loadedData = () => ({
  type: types.LOADED_DATA,
});

export const updateLang = ({ lang }) => ({
  type: types.UPDATE_LANG,
  lang,
});

export const updateDimension = ({ width, height }) => ({
  type: types.UPDATE_DIMENSION,
  width,
  height,
});

export const loadingModule = () => ({
  type: types.LOADING_MODULE,
});

export const loadedModule = (loaded) => ({
  type: types.LOADED_MODULE,
  loaded,
});

export const loadingModuleError = () => ({
  type: types.LOADING_MODULE_ERROR,
});

export const modalOpen = ({ title, content, actions, ops }) => ({
  type: types.MODAL_OPEN,
  title,
  content,
  actions,
  ops,
});

export const modalClose = () => ({
  type: types.MODAL_CLOSE,
});

export const zoomerOpen = (image) => ({
  type: types.ZOOMER_OPEN,
  image,
});

export const zoomerClose = () => ({
  type: types.ZOOMER_CLOSE,
});

export const diaryOpen = (content) => ({
  type: types.DIARY_OPEN,
  content,
});

export const diaryClose = () => ({
  type: types.DIARY_CLOSE,
});

export const photoSwipeOpen = (items, ops) => ({
  type: types.PHOTOSWIPE_OPEN,
  items,
  ops,
});

export const photoSwipeClose = () => ({
  type: types.PHOTOSWIPE_CLOSE,
});

export const uploaderStart = (dest) => ({
  type: types.UPLOADER_START,
  dest,
});

export const uploaderStop = () => ({
  type: types.UPLOADER_STOP,
});

export const snackBarOpen = (message, config) => ({
  type: types.SNACKBAR_OPEN,
  message,
  config,
});

export const snackBarClose = () => ({
  type: types.SNACKBAR_CLOSE,
});

export const selectCounter = (groupCounter) => ({
  type: types.SELECT_COUNTER,
  selectImages: groupCounter.selectImages,
  group: groupCounter.group,
  counter: groupCounter.counter,
});

export const selectGroupCounter = (groupCounter) => ({
  type: types.SELECT_GROUP_COUNTER,
  selectImages: groupCounter.selectImages,
  group: groupCounter.group,
  counter: groupCounter.counter,
});

export const enableSelectAll = (groupCounter) => ({
  type: types.ENABLE_SELECT_ALL,
  selectImages: groupCounter.selectImages,
  group: groupCounter.group,
  counter: groupCounter.counter,
});

export const disableSelectAll = () => ({
  type: types.DISABLE_SELECT_ALL,
});

export const saveUser = (user) => ({
  type: types.SAVE_USER,
  user,
});

export const clearUser = () => ({
  type: types.CLEAR_USER,
});

export const authSuccess = () => ({
  type: types.AUTH_SUCCESS,
});

export const authFail = (state) => ({
  type: types.AUTH_FAIL,
  state,
});

// const delay = () => new Promise((resolve) => {
//   setTimeout(resolve, 750);
// });

export const fetchAuth = (policy, args) => async (dispatch) => {
  try {
    dispatch({ type: types.FETCH_AUTH });
    // await delay();
    const data = await policy(args);
    if (data.isAuthenticated) {
      dispatch(authSuccess());
    } else {
      dispatch(authFail(data.state));
      dispatch(replace(data.state.redirect));
      dispatch(snackBarOpen(data.state.message));
    }
  } catch (err) {
    dispatch(authFail(err.error || '/500'));
    dispatch(replace(`/${err.error || 500}`));
    dispatch(snackBarOpen(err.reason || '服务器内部错误'));
    console.warn(err);
  }
};

export const saveUptoken = (uptoken) => ({
  type: types.SAVE_UPTOKEN,
  uptoken,
});

export const clearUptoken = () => ({
  type: types.CLEAR_USER,
});

export const userLogin = ({ account, password, inExpiration = false }) => async (dispatch) => {
  try {
    if (!inExpiration) {
      const loginWithPassword = Meteor.wrapPromise(Meteor.loginWithPassword);
      await loginWithPassword(account, password);
    }
    dispatch(saveUser(Meteor.user()));
    console.log('%c User Login', 'color: blue');
    const { uptoken } = await Meteor.callPromise('Qiniu.getUptoken');
    dispatch(saveUptoken(uptoken));
    console.log('%c User get uptoken', 'color: blue');
  } catch (err) {
    console.warn(err);
    if (Meteor.user()) {
      dispatch(snackBarOpen(`获取七牛云token失败 ${err}`));
    } else {
      dispatch(snackBarOpen(`登录失败 ${err}`));
    }
  }
};

export const userLogout = () => async (dispatch) => {
  try {
    const logoutPromise = Meteor.wrapPromise(Meteor.logout);
    await logoutPromise();
    dispatch(snackBarOpen('登出成功'));
    dispatch(clearUser());
    dispatch(clearUptoken());
  } catch (err) {
    console.warn(err);
    dispatch(snackBarOpen(`登出失败 ${err.reason}`));
  }
};

