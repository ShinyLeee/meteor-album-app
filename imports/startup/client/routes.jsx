import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { Provider } from 'react-redux';

import App from '/imports/ui/App.jsx';
import Index from '/imports/ui/layouts/Index.jsx';
import Upload from '/imports/ui/layouts/Upload.jsx';
import User from '/imports/ui/layouts/User.jsx';
import Collection from '/imports/ui/layouts/Collection.jsx';
import Setting from '/imports/ui/layouts/Setting.jsx';
import Login from '/imports/ui/layouts/Login.jsx';
import Register from '/imports/ui/layouts/Register.jsx';
import NotFound from '/imports/ui/layouts/NotFound.jsx';

import UserNotes from '/imports/ui/components/UserNotes.jsx';
import UserLiked from '/imports/ui/components/UserLiked.jsx';
import store from '/imports/ui/store.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { requireAuth, isLogin } from './proxy.js';

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Index} />
          <Route path="upload" component={Upload} onEnter={requireAuth} />
          <Route path="user" component={User} onEnter={requireAuth}>
            <IndexRoute component={UserNotes} />
            <Route path="liked" component={UserLiked} />
            <Redirect from="notes" to="/user" />
          </Route>
          <Route path="collection" component={Collection} onEnter={requireAuth} />
          <Route path="setting" component={Setting} onEnter={requireAuth} />
          <Route path="login" component={Login} onEnter={isLogin} />
          <Route path="register" component={Register} />
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
