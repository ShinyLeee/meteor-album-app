export default {
  sessions: {
    initializing: true,
    User: null,
    uptoken: '',
  },

  portals: {
    modal: { open: false, title: '', content: null, actions: [], ops: null },
    zoomer: { open: false, image: null },
    dialog: { open: false, content: null },
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
