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
import AccessDenied from '/imports/ui/pages/AccessDenied.jsx';
import NotFound from '/imports/ui/pages/NotFound.jsx';

// import UserNotes from '/imports/ui/components/UserNotes.jsx';
// import UserLiked from '/imports/ui/components/UserLiked.jsx';
import reducers from '/imports/ui/reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { isLogin, isLogout, isAllowVisitHome, isAllowVisitColl } from './policies.js';

const store = createStore(reducers);

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Index} />
          <Redirect from="explore" to="/" />
          <Route path="user/:username" component={User} onEnter={isAllowVisitHome} />
          <Route path="user/:username/collection" component={Collection} onEnter={isAllowVisitColl} />
          <Route path="user/:username/collection/:colName" component={ColPics} onEnter={isAllowVisitColl} />
          <Route path="memory" component={Constructing} onEnter={isLogin} />
          <Route path="recycle" component={Constructing} onEnter={isLogin} />
          <Route path="setting" component={Setting} onEnter={isLogin} />
          <Route path="sendNote" component={SendNote} onEnter={isLogin} />
          <Route path="login" component={Login} onEnter={isLogout} />
          <Route path="register" component={Register} onEnter={isLogout} />
          <Route path="403" component={AccessDenied} />
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
