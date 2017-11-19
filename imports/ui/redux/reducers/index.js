import { combineReducers } from 'redux';
import {
  sessions,
  device,
  portals,
  selectCounter,
} from './reducers';

const reducers = combineReducers({
  sessions,
  device,
  portals,
  selectCounter,
});

export default reducers;
