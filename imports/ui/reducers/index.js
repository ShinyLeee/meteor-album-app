import { combineReducers } from 'redux';
import { user, zoomer, uploader } from './reducer';

const reducers = combineReducers({
  user,
  zoomer,
  uploader,
});

export default reducers;
