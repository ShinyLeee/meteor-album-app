import { combineReducers } from 'redux';
import { user, zoomer } from './reducer';

const reducers = combineReducers({
  user,
  zoomer,
});

export default reducers;
