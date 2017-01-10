import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import PC from '/imports/ui/App_PC.jsx';
import AppContainer from '/imports/ui/containers/AppContainer.jsx';
import Login from '/imports/ui/containers/LoginContainer.jsx';
import Register from '/imports/ui/containers/RegisterContainer.jsx';
import Index from '/imports/ui/containers/IndexContainer.jsx';
import User from '/imports/ui/containers/UserContainer.jsx';
import Collection from '/imports/ui/containers/CollectionContainer.jsx';
import CollPics from '/imports/ui/containers/CollPicsContainer.jsx';
import Recycle from '/imports/ui/containers/RecycleContainer.jsx';
import Setting from '/imports/ui/containers/SettingContainer.jsx';
import Note from '/imports/ui/containers/NoteContainer.jsx';
import AllNotes from '/imports/ui/containers/AllNotesContainer.jsx';
import SendNote from '/imports/ui/containers/SendNoteContainer.jsx';
import {
  ConnectedConstruction,
  ConnectedForbidden,
  ConnectedInternalError,
  ConnectedNotFound,
} from '/imports/ui/containers/ErrorContainers.jsx';

import { platform } from '/imports/utils/utils.js';
import reducers from '/imports/ui/redux/reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { isLogin, isLogout, isPermission, isAllowVisitHome, isAllowVisitColl } from './policies.js';

const store = createStore(reducers);

const Root = () => {
  const isMobile = platform().mobile;
  if (!isMobile) return <PC />;
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <Route path="/" component={AppContainer}>
            <IndexRoute component={Index} />
            <Redirect from="explore" to="/" />
            <Route path="user/:username" component={User} onEnter={isAllowVisitHome} />
            <Route path="user/:username/collection" component={Collection} onEnter={isAllowVisitColl} />
            <Route path="user/:username/collection/:cname" component={CollPics} onEnter={isAllowVisitColl} />
            <Route path="memory" component={ConnectedConstruction} onEnter={isLogin} />
            <Route path="recycle" component={Recycle} onEnter={isLogin} />
            <Route path="setting" component={Setting} onEnter={isLogin} />
            <Route path="note/:username" component={Note} onEnter={isPermission} />
            <Route path="note/:username/all" component={AllNotes} onEnter={isPermission} />
            <Route path="sendNote" component={SendNote} onEnter={isLogin} />
            <Route path="login" component={Login} onEnter={isLogout} />
            <Route path="register" component={Register} onEnter={isLogout} />
            <Route path="403" component={ConnectedForbidden} />
            <Route path="404" component={ConnectedNotFound} />
            <Route path="500" component={ConnectedInternalError} />
            <Route path="*" component={ConnectedNotFound} />
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
