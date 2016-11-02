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
