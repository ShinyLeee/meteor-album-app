import { combineReducers } from 'redux';
import {
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
