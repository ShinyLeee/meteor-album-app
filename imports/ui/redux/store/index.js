import { createStore } from 'redux';
import reducers from '../reducers';
import initState from './initState';

export default createStore(
  reducers,
  initState,
);
