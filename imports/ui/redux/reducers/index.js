import { combineReducers } from 'redux';
import {
  User,
  uptoken,
  zoomer,
  dialog,
  diary,
  photoSwipe,
  uploader,
  snackBar,
  selectCounter,
} from './reducers';

const reducers = combineReducers({
  User,
  uptoken,
  zoomer,
  dialog,
  diary,
  photoSwipe,
  uploader,
  snackBar,
  selectCounter,
});

export default reducers;
