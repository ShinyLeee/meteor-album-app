import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {
  sessions,
  modules,
  device,
  portals,
  selectCounter,
} from './reducers';

const reducers = combineReducers({
  sessions,
  modules,
  device,
  portals,
  selectCounter,
  router: routerReducer,
});

export default reducers;
