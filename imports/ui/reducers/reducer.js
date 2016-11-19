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

export const snackBar = (state = null, action) => {
  const message = action.message;
  const config = action.config;
  switch (action.type) {
    case 'SNACKBAR_OPEN':
      return Object.assign({}, { message, open: true }, config);
    case 'SNACKBAR_CLOSE':
      return null;
    default:
      return state;
  }
};
