import * as types from '../constants/ActionTypes';

export const storeUptoken = (uptoken) => ({
  type: types.STORE_UPTOKEN,
  uptoken,
});

export const clearUptoken = () => ({
  type: types.CLEAR_UPTOKEN,
});

export const zoomerOpen = (image) => ({
  type: types.ZOOMER_OPEN,
  image,
});

export const zoomerClose = () => ({
  type: types.ZOOMER_CLOSE,
});

export const dialogFetch = () => ({
  type: types.DIALOG_FETCH,
});

export const dialogOpen = (bible) => ({
  type: types.DIALOG_OPEN,
  bible,
});

export const dialogClose = () => ({
  type: types.DIALOG_CLOSE,
});

export const uploaderStart = (uploader) => ({
  type: types.UPLOADER_START,
  uploader,
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
