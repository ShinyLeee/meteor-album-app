import { combineReducers } from 'redux';
import { zoomer, uploader, snackBar, selectCounter } from './reducer';

const reducers = combineReducers({
  zoomer,
  uploader,
  snackBar,
  selectCounter,
});

export default reducers;
