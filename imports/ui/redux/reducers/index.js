import { combineReducers } from 'redux';
import { uptoken, zoomer, uploader, snackBar, selectCounter } from './reducers';

const reducers = combineReducers({
  uptoken,
  zoomer,
  uploader,
  snackBar,
  selectCounter,
});

export default reducers;
