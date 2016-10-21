import { createStore } from 'redux';
import reducers from '/imports/ui/reducers';

const store = createStore(reducers);
export default store;
