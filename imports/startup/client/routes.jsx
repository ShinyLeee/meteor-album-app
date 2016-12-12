import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from '/imports/ui/App.jsx';
import Index from '/imports/ui/pages/Index.jsx';
import User from '/imports/ui/pages/User.jsx';
import Collection from '/imports/ui/pages/Collection.jsx';
import ColPics from '/imports/ui/pages/ColPics.jsx';
import Setting from '/imports/ui/pages/Setting.jsx';
import SendNote from '/imports/ui/pages/SendNote.jsx';
import Login from '/imports/ui/pages/Login.jsx';
import Register from '/imports/ui/pages/Register.jsx';
import Constructing from '/imports/ui/pages/Constructing.jsx';
import NotFound from '/imports/ui/pages/NotFound.jsx';

import UserNotes from '/imports/ui/components/UserNotes.jsx';
import UserLiked from '/imports/ui/components/UserLiked.jsx';
import reducers from '/imports/ui/reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { requireAuth, isLogin } from './proxy.js';

const store = createStore(reducers);

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Index} />
          <Route path="user" component={User} onEnter={requireAuth}>
            <IndexRoute component={UserNotes} />
            <Route path="liked" component={UserLiked} />
            <Redirect from="notes" to="/user" />
          </Route>
          <Route path="collection" component={Collection} onEnter={requireAuth} />
          <Route path="collection/:colName" component={ColPics} onEnter={requireAuth} />
          <Route path="memory" component={Constructing} />
          <Route path="recycle" component={Constructing} />
          <Route path="setting" component={Setting} onEnter={requireAuth} />
          <Route path="sendNote" component={SendNote} onEnter={requireAuth} />
          <Route path="login" component={Login} onEnter={isLogin} />
          <Route path="register" component={Register} onEnter={isLogin} />
          <Route path="404" component={NotFound} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </MuiThemeProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
