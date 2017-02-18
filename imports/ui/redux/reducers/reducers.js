import { _ } from 'meteor/underscore';

export const uptoken = (state = '', action) => {
  if (action.type === 'STORE_UPTOKEN') {
    return action.uptoken;
  }
  if (action.type === 'CLEAR_UPTOKEN') {
    return null;
  }
  return state;
};

export const zoomer = (state = { open: false, image: null }, action) => {
  switch (action.type) {
    case 'ZOOMER_OPEN':
      return Object.assign({ open: true }, { image: action.image });
    case 'ZOOMER_CLOSE':
      return { open: false, image: null };
    default:
      return state;
  }
};

export const dialog = (state = { open: false, bible: null }, action) => {
  switch (action.type) {
    case 'DIALOG_FETCH':
      return Object.assign({ open: true, bible: null });
    case 'DIALOG_OPEN':
      return Object.assign({ open: true }, { bible: action.bible });
    case 'DIALOG_CLOSE':
      return { open: false, bible: null };
    default:
      return state;
  }
};

export const diary = (state = { open: false, diary: null }, action) => {
  switch (action.type) {
    case 'DIARY_OPEN':
      return Object.assign({ open: true }, { diary: action.diary });
    case 'DIARY_CLOSE':
      return { open: false, diary: null };
    default:
      return state;
  }
};

export const photoSwipe = (state = { open: false, options: null }, action) => {
  switch (action.type) {
    case 'PHOTOSWIPE_OPEN':
      return Object.assign({ open: true }, { options: action.options });
    case 'PHOTOSWIPE_CLOSE':
      return { open: false, options: null };
    default:
      return state;
  }
};

export const uploader = (state = null, action) => {
  switch (action.type) {
    case 'UPLOADER_START':
      return Object.assign({}, action.uploader, { open: true });
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

export const selectCounter = (state = { selectImages: [], group: {}, counter: 0 }, action) => {
  switch (action.type) {
    /**
     * Return the new gloabl counter and group state, when select or cancel one photo
     * @param {array}  state.selectImages - select images' detail
     * @param {number} state.counter - how many photos selected
     * @param {object} state.group - how many group photos selected
     * @param {array}  action.selectImages
     * @param {number} action.counter - incre or decre the specific number { +-1 }
     * @param {string} action.group - group name
     *
     * If state.group is NOT EXIST, eg: {},
     * We Create a new group, eg: { 20160101: 1 }, Means the group 20160101 select ONE photo
     *
     * else if state.group is CREATED, eg: { 20160101: 1 },
     * We make new group extend the previous group,
     *
     *   If we store group before,
     *      the group's counter need to PLUS state.group[action.group],
     *   eg: { 20160101: 1 } extend { 20160101: 1 } => { 20160101: 1 + 1 }
     *
     *   else the new group's counter is equal action.counter
     *   eg: { 20160202: 1 } extend { 20160101: 1 } => { 20160101: 1, 20160202: 1 }
     *
     * Finally we create and return a new Object which contains counter group props
     */
    case 'SELECT_COUNTER': {
      let selectImages;
      const nextImage = action.selectImages;
      const prevImages = state.selectImages;
      if (prevImages.length === 0) selectImages = [...nextImage];
      else {
        // If select a photo, just concat nextImage with prevImages
        if (action.counter > 0) {
          selectImages = [...prevImages, ...nextImage];
        }
        // If disselect a photo, we need to remove nextImage from prevImages
        if (action.counter < 0) {
          // selectImages = _.filter(prevImages, (prevImage) => prevImage !== nextImage[0]);
          selectImages = _.filter(prevImages, (prevImage) => prevImage._id !== nextImage[0]._id);
        }
      }

      let group;
      const day = action.group;
      // When group is empty object: {}
      if (Object.keys(state.group).length === 0) group = { [day]: action.counter };
      else {
        const newGroup = { [day]: (state.group[day] || 0) + action.counter };
        group = _.extend(state.group, newGroup);
      }

      // console.log(selectImages);
      const counter = state.counter + action.counter;
      if (counter === 0) group = {};
      const globalCounter = Object.assign({}, { selectImages }, { group }, { counter });
      return globalCounter;
    }
    /**
     * Return the new gloabl counter and group state, when select or cancel a group's all photo
     * @param {array}  state.selectImages - select images' detail
     * @param {number} state.counter - how many photos selected
     * @param {object} state.group - how many group photos selected
     * @param {array}  action.selectImages
     * @param {number} action.counter - incre or decre the specific number { +-groupTotal }
     * @param {string} action.group - group name
     *
     * Similar with SELECT_COUNTER, except groupCounter
     *
     * If the action.counter > 0, which means the group's photo has been select some,
     * so we can not incre the whole groupTotal,
     * however the groupCounter = action.counter - state.group[action.group].
     */
    case 'SELECT_GROUP_COUNTER': {
      const groupCounter = action.counter;

      let selectImages;
      const nextImages = action.selectImages;
      const prevImages = state.selectImages;
      if (prevImages.length === 0) selectImages = [...nextImages];
      else {
        if (groupCounter > 0) {
          selectImages = _.uniq([...prevImages, ...nextImages], (image) => image._id);
        }
        // If disselect a group, we need to remove nextImages from prevImages
        if (groupCounter < 0) {
          // selectImages = _.filter(prevImages, (prevImage) => _.indexOf(nextImages, prevImage) < 0);

          // Deal with array of object
          selectImages = _.filter(prevImages, (prevImage) => {
            const nextImagesId = _.map(nextImages, (nextImage) => nextImage._id);
            return _.indexOf(nextImagesId, prevImage._id) < 0;
          });
        }
      }

      let group;
      const prevGroup = state.group;
      const day = action.group;
      if (Object.keys(prevGroup).length === 0) group = { [day]: groupCounter };
      else {
        if (groupCounter > 0) {
          const newGroup = { [day]: groupCounter };
          group = Object.assign({}, prevGroup, newGroup);
        }
        if (groupCounter < 0) {
          group = Object.assign({}, prevGroup);
          delete group[day];
        }
      }

      let counter = state.counter + groupCounter;
      if (prevGroup[day] && groupCounter > 0) counter = state.counter + (groupCounter - prevGroup[day]);
      if (counter === 0) group = {};
      const globalCounter = Object.assign({}, { selectImages }, { group }, { counter });
      return globalCounter;
    }
    // If select * , { selectImages: [...allImages], group: [...allGroups], counter: total
    case 'ENABLE_SELECT_ALL':
      // console.log(action.selectImages);
      return { selectImages: action.selectImages, group: action.group, counter: action.counter };
    case 'DISABLE_SELECT_ALL':
      return { selectImages: [], group: {}, counter: 0 };
    default:
      return state;
  }
};
