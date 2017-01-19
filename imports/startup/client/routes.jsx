import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import PC from '/imports/ui/App_PC.jsx';
import App from '/imports/ui/App.jsx';
import Login from '/imports/ui/pages/Sign/pages/Login/Login.jsx';
import Register from '/imports/ui/pages/Sign/pages/Register/Register.jsx';
import Index from '/imports/ui/pages/Index/index.js';
import User from '/imports/ui/pages/User/index.js';
import AllCollections from '/imports/ui/pages/Collection/pages/AllCollections/index.js';
import Colletion from '/imports/ui/pages/Collection/pages/Collection/index.js';
import Recycle from '/imports/ui/pages/Recycle/index.js';
import Setting from '/imports/ui/pages/Setting/index.js';
import Note from '/imports/ui/pages/Note/pages/Note/index.js';
import AllNotes from '/imports/ui/pages/Note/pages/AllNotes/index.js';
import SendNote from '/imports/ui/pages/Note/pages/SendNote/index.js';
import Construction from '/imports/ui/pages/Error/Construction.jsx';
import Forbidden from '/imports/ui/pages/Error/Forbidden.jsx';
import InternalError from '/imports/ui/pages/Error/InternalError.jsx';
import NotFound from '/imports/ui/pages/Error/NotFound.jsx';

import { platform } from '/imports/utils/utils.js';
import reducers from '/imports/ui/redux/reducers';

import { isLogin, isLogout, isPermission, isAllowVisitHome, isAllowVisitColl } from './policies.js';

const store = createStore(reducers);

const Root = () => {
  const isMobile = platform().mobile;
  if (!isMobile) return <PC />;
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Index} />
            <Redirect from="explore" to="/" />
            <Route path="user/:username" component={User} onEnter={isAllowVisitHome} />
            <Route path="user/:username/collection" component={AllCollections} onEnter={isAllowVisitColl} />
            <Route path="user/:username/collection/:cname" component={Colletion} onEnter={isAllowVisitColl} />
            <Route path="memory" component={Construction} onEnter={isLogin} />
            <Route path="recycle" component={Recycle} onEnter={isLogin} />
            <Route path="setting" component={Setting} onEnter={isLogin} />
            <Route path="note/:username" component={Note} onEnter={isPermission} />
            <Route path="note/:username/all" component={AllNotes} onEnter={isPermission} />
            <Route path="sendNote" component={SendNote} onEnter={isLogin} />
            <Route path="login" component={Login} onEnter={isLogout} />
            <Route path="register" component={Register} onEnter={isLogout} />
            <Route path="403" component={Forbidden} />
            <Route path="404" component={NotFound} />
            <Route path="500" component={InternalError} />
            <Route path="*" component={NotFound} />
          </Route>
        </Router>
      </MuiThemeProvider>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
