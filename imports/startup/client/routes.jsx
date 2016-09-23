import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// Components
import App from '/imports/ui/App.jsx';
import Index from '/imports/ui/layouts/Index.jsx';
import Upload from '/imports/ui/layouts/Upload.jsx';
import Login from '/imports/ui/layouts/Login.jsx';
import Register from '/imports/ui/layouts/Register.jsx';
import NotFound from '/imports/ui/layouts/NotFound.jsx';

function requireAuth(nextState, replace) {
  // Only When User is loggingIn or has logined return true
  if (Meteor.loggingIn() || Meteor.user()) return true;
  return replace({
    pathname: '/login',
    state: { nextPathname: nextState.location.pathname },
  });
}

export default () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} onEnter={requireAuth} />
      <Route path="upload" component={Upload} onEnter={requireAuth} />
      <Route path="login" component={Login} />
      <Route path="register" component={Register} />
      <Route path="404" component={NotFound} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
