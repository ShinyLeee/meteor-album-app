export const user = (state = null, action) => {
  switch (action.type) {
    case 'USER_CREATE':
      return action.user;
    case 'USER_LOGIN':
      return action.user;
    case 'USER_LOGOUT':
      return action.user;
    default:
      return state;
  }
};

export const zoomer = (state = null, action) => {
  switch (action.type) {
    case 'ZOOMER_OPEN':
      return Object.assign({ image: action.image }, { open: true });
    case 'ZOOMER_CLOSE':
      return null;
    default:
      return state;
  }
};

export const uploader = (state = null, action) => {
  switch (action.type) {
    case 'UPLOADER_START':
      return Object.assign(action.uploader, { open: true });
    case 'UPLOADER_STOP':
      return null;
    default:
      return state;
  }
};
