export const zoomerOpen = (image) => ({
  type: 'ZOOMER_OPEN',
  image,
});

export const zoomerClose = () => ({
  type: 'ZOOMER_CLOSE',
});

export const uploaderStart = (uploader) => ({
  type: 'UPLOADER_START',
  uploader,
});

export const uploaderStop = () => ({
  type: 'UPLOADER_STOP',
});

export const snackBarOpen = (message, config) => ({
  type: 'SNACKBAR_OPEN',
  message,
  config,
});

export const snackBarClose = () => ({
  type: 'SNACKBAR_CLOSE',
});

export const selectCounter = (groupCounter) => ({
  type: 'SELECT_COUNTER',
  group: groupCounter.group,
  counter: groupCounter.counter,
});

export const selectGroupCounter = (groupCounter) => ({
  type: 'SELECT_GROUP_COUNTER',
  group: groupCounter.group,
  counter: groupCounter.counter,
});

export const enableSelectAll = (groupCounter) => ({
  type: 'ENABLE_SELECT_ALL',
  group: groupCounter.group,
  counter: groupCounter.counter,
});

export const disableSelectAll = () => ({
  type: 'DISABLE_SELECT_ALL',
  group: null,
  counter: 0,
});
