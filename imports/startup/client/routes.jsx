import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { Provider } from 'react-redux';

// Components
import App from '/imports/ui/App.jsx';
import Index from '/imports/ui/layouts/Index.jsx';
import Upload from '/imports/ui/layouts/Upload.jsx';
import User from '/imports/ui/layouts/User.jsx';
import Login from '/imports/ui/layouts/Login.jsx';
import Register from '/imports/ui/layouts/Register.jsx';
import NotFound from '/imports/ui/layouts/NotFound.jsx';

import UserContent from '/imports/ui/components/UserContent.jsx';
import store from '/imports/ui/store.js';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { requireAuth, isLogin } from './proxy.js';

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Index} onEnter={requireAuth} />
          <Route path="upload" component={Upload} onEnter={requireAuth} />
          <Route path="user" component={User} onEnter={requireAuth}>
            <IndexRoute component={UserContent} / >
            <Route path="notes" component={UserContent} />
            <Redirect from="liked" to="/user" />
          </Route>
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
