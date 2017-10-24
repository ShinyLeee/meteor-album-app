import { Meteor } from 'meteor/meteor';
import * as types from '../constants/ActionTypes';

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

export const photoSwipeOpen = (items, options) => ({
  type: types.PHOTOSWIPE_OPEN,
  items,
  options,
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

export const storeUser = (user) => ({
  type: types.STORE_USER,
  user,
});

export const storeUptoken = (uptoken) => ({
  type: types.STORE_UPTOKEN,
  uptoken,
});

export const userLogin = (user) => async (dispatch) => {
  dispatch(storeUser(user));
  try {
    const res = await Meteor.callPromise('Qiniu.getUptoken');
    console.log('%c User Login', 'color: blue');
    dispatch(storeUptoken(res.uptoken));
  } catch (err) {
    console.log(err);
    dispatch(snackBarOpen(`获取七牛云token失败 ${err}`));
  }
};

export const userLogout = () => ({
  type: types.USER_LOGOUT,
});

