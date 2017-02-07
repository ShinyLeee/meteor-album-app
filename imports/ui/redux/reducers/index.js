import { combineReducers } from 'redux';
import {
  uptoken,
  zoomer,
  dialog,
  uploader,
  snackBar,
  selectCounter,
} from './reducers';

const reducers = combineReducers({
  uptoken,
  zoomer,
  dialog,
  uploader,
  snackBar,
  selectCounter,
});

export default reducers;
