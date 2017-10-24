import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import initState from './initState';

export default createStore(
  reducers,
  initState,
  applyMiddleware(thunk),
);
