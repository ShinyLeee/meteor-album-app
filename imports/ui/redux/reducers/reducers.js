import _ from 'lodash';
import * as types from '../constants/ActionTypes';
import initState from '../store/initState';

export const sessions = (state = initState.sessions, action) => {
  switch (action.type) {
    case types.APP_INIT:
      return {
        ...state,
        initializing: false,
      };
    case types.USER_LOGIN:
      return {
        ...state,
        User: action.user,
      };
    case types.USER_LOGOUT:
      return {
        ...state,
        User: null,
      };
    case types.STORE_UPTOKEN:
      return {
        ...state,
        uptoken: action.uptoken,
      };
    case types.CLEAR_UPTOKEN:
      return {
        ...state,
        uptoken: '',
      };
    default: {
      return state;
    }
  }
};

export const portals = (state = initState.portals, action) => {
  switch (action.type) {
    case types.MODAL_OPEN:
      return {
        ...state,
        modal: {
          open: true,
          title: action.title,
          content: action.content,
          actions: action.actions,
          ops: action.ops,
        },
      };
    case types.MODAL_CLOSE:
      return {
        ...state,
        modal: {
          ...state.modal,
          open: false,
        },
      };
    case types.ZOOMER_OPEN:
      return {
        ...state,
        zoomer: {
          open: true,
          image: action.image,
        },
      };
    case types.ZOOMER_CLOSE:
      return {
        ...state,
        zoomer: initState.portals.zoomer,
      };
    case types.DIALOG_FETCH:
      return {
        ...state,
        dialog: {
          open: true,
          content: null,
        },
      };
    case types.DIALOG_OPEN:
      return {
        ...state,
        dialog: {
          open: true,
          content: action.content,
        },
      };
    case types.DIALOG_CLOSE:
      return {
        ...state,
        dialog: initState.portals.dialog,
      };
    case types.DIARY_OPEN:
      return {
        ...state,
        diary: {
          open: true,
          content: action.content,
        },
      };
    case types.DIARY_CLOSE:
      return {
        ...state,
        diary: initState.portals.diary,
      };
    case types.PHOTOSWIPE_OPEN:
      return {
        ...state,
        photoSwipe: {
          open: true,
          items: action.items,
          ops: action.ops,
        },
      };
    case types.PHOTOSWIPE_CLOSE:
      return {
        ...state,
        photoSwipe: initState.portals.photoSwipe,
      };
    case types.UPLOADER_START:
      return {
        ...state,
        uploader: {
          open: true,
          dest: action.dest,
        },
      };
    case types.UPLOADER_STOP:
      return {
        ...state,
        uploader: initState.portals.uploader,
      };
    case types.SNACKBAR_OPEN:
      return {
        ...state,
        snackBar: {
          open: true,
          message: action.message,
          config: action.config,
        },
      };
    case types.SNACKBAR_CLOSE:
      return {
        ...state,
        snackBar: initState.portals.snackBar,
      };
    default: {
      return state;
    }
  }
};

export const selectCounter = (state = initState.selectCounter, action) => {
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
    case types.SELECT_COUNTER: {
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
        group = Object.assign({}, state.group, newGroup);
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
    case types.SELECT_GROUP_COUNTER: {
      const groupCounter = action.counter;

      let selectImages;
      const nextImages = action.selectImages;
      const prevImages = state.selectImages;
      if (prevImages.length === 0) selectImages = [...nextImages];
      else {
        if (groupCounter > 0) {
          selectImages = _.uniqBy([...prevImages, ...nextImages], (image) => image._id);
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
    case types.ENABLE_SELECT_ALL:
      // console.log(action.selectImages);
      return { selectImages: action.selectImages, group: action.group, counter: action.counter };
    case types.DISABLE_SELECT_ALL:
      return { selectImages: [], group: {}, counter: 0 };
    default:
      return state;
  }
};
