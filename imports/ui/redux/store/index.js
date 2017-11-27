import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import history from '/imports/utils/history';
import reducers from '../reducers';
import initState from './initState';

const router = routerMiddleware(history);

export default createStore(
  reducers,
  initState,
  applyMiddleware(
    thunk,
    router,
  ),
);
