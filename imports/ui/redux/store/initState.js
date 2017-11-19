export default {
  sessions: {
    isLoggedIn: false,
    User: null,
    uptoken: null,
  },

  device: {
    agent: window.navigator.userAgent,
    lang: window.navigator.language || window.navigator.userLanguage,
    width: window.screen.width,
    height: window.screen.height,
    pixelRatio: window.devicePixelRatio,
  },

  portals: {
    modal: { open: false, title: '', content: null, actions: [], ops: null },
    zoomer: { open: false, image: null },
    diary: { open: false, content: null },
    photoSwipe: { open: false, items: [], ops: null },
    uploader: { open: false, dest: '' },
    snackBar: { open: false, message: '', config: null },
  },

  selectCounter: {
    selectImages: [],
    group: {},
    counter: 0,
  },
};
