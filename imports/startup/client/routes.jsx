import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import PC from '/imports/ui/App_PC.jsx';
import App from '/imports/ui/App.jsx';
import Index from '/imports/ui/pages/Index/Index.jsx';
import User from '/imports/ui/pages/User/User.jsx';
import Collection from '/imports/ui/pages/Collection/Collection.jsx';
import ColPics from '/imports/ui/pages/Collection/ColPics.jsx';
import Recycle from '/imports/ui/pages/Recycle/Recycle.jsx';
import Setting from '/imports/ui/pages/Setting/Setting.jsx';
import Note from '/imports/ui/pages/Note/Note.jsx';
import AllNotes from '/imports/ui/pages/Note/AllNotes.jsx';
import SendNote from '/imports/ui/pages/Note/SendNote.jsx';
import Login from '/imports/ui/pages/Login/Login.jsx';
import Register from '/imports/ui/pages/Register/Register.jsx';
import Construction from '/imports/ui/pages/Error/Construction.jsx';
import Forbidden from '/imports/ui/pages/Error/Forbidden.jsx';
import NotFound from '/imports/ui/pages/Error/NotFound.jsx';
import InternalError from '/imports/ui/pages/Error/InternalError.jsx';
import { platform } from '/imports/utils/utils.js';
import reducers from '/imports/ui/redux/reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { isLogin, isLogout, isAllowVisitHome, isAllowVisitColl } from './policies.js';

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
            <Route path="user/:username/collection" component={Collection} onEnter={isAllowVisitColl} />
            <Route path="user/:username/collection/:colName" component={ColPics} onEnter={isAllowVisitColl} />
            <Route path="memory" component={Construction} onEnter={isLogin} />
            <Route path="recycle" component={Recycle} onEnter={isLogin} />
            <Route path="setting" component={Setting} onEnter={isLogin} />
            <Route path="note" component={Note} onEnter={isLogin} />
            <Route path="allNotes" component={AllNotes} onEnter={isLogin} />
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
