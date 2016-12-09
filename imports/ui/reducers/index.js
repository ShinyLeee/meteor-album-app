import { combineReducers } from 'redux';
import { uptoken, zoomer, uploader, snackBar, selectCounter } from './reducer';

const reducers = combineReducers({
  uptoken,
  zoomer,
  uploader,
  snackBar,
  selectCounter,
});

export default reducers;
