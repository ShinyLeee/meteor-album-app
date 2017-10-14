export default {
  sessions: {
    User: null,
    uptoken: '',
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
