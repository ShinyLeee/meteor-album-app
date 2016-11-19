import { combineReducers } from 'redux';
import { zoomer, uploader, snackBar } from './reducer';

const reducers = combineReducers({
  zoomer,
  uploader,
  snackBar,
});

export default reducers;
