import { Meteor } from 'meteor/meteor';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import history from '/imports/utils/history';
import reducers from '../reducers';
import initState from './initState';

const logger = createLogger({
  predicate: () => Meteor.isDevelopment,
  collapsed: true,
  duration: true,
});

const router = routerMiddleware(history);

export default createStore(
  reducers,
  initState,
  applyMiddleware(
    thunk,
    router,
    logger,
  ),
);
