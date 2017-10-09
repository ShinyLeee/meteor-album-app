import { combineReducers } from 'redux';
import {
  sessions,
  portals,
  selectCounter,
} from './reducers';

const reducers = combineReducers({
  sessions,
  portals,
  selectCounter,
});

export default reducers;
