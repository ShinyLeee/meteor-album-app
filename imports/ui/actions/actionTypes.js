export const userCreate = (user) => ({
  type: 'USER_CREATE',
  user,
});

export const userLogin = (user) => ({
  type: 'USER_LOGIN',
  user,
});

export const userLogout = (user) => ({
  type: 'USER_LOGOUT',
  user,
});

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
