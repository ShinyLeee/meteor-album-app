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
