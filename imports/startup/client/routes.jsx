import React, { PropTypes } from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import PC from '/imports/ui/App_PC.jsx';
import AppContainer from '/imports/ui/App.jsx';
import Login from '/imports/ui/pages/Sign/pages/Login/Login.jsx';
import Register from '/imports/ui/pages/Sign/pages/Register/Register.jsx';
import Index from '/imports/ui/pages/Index/index.js';
import User from '/imports/ui/pages/User/index.js';
import UserLikes from '/imports/ui/pages/User/pages/UserLikes/index.js';
import UserFans from '/imports/ui/pages/User/pages/UserFans/index.js';
import AllCollections from '/imports/ui/pages/Collection/pages/AllCollections/index.js';
import Colletion from '/imports/ui/pages/Collection/pages/Collection/index.js';
import Diary from '/imports/ui/pages/Diary/pages/Diary/index.js';
import WriteDiary from '/imports/ui/pages/Diary/pages/Write/index.js';
import Recycle from '/imports/ui/pages/Recycle/index.js';
import Setting from '/imports/ui/pages/Setting/pages/Setting/index.js';
import SettingEmails from '/imports/ui/pages/Setting/pages/Emails/index.js';
import SettingPassword from '/imports/ui/pages/Setting/pages/Password/index.js';
import Note from '/imports/ui/pages/Note/pages/Note/index.js';
import AllSentNotes from '/imports/ui/pages/Note/pages/AllSentNotes/index.js';
import AllNotes from '/imports/ui/pages/Note/pages/AllNotes/index.js';
import SendNote from '/imports/ui/pages/Note/pages/SendNote/index.js';
import Search from '/imports/ui/pages/Search/pages/Search/index.js';
import SearchResults from '/imports/ui/pages/Search/pages/Results/index.js';
import VerifyEmail from '/imports/ui/pages/Account/pages/VerifyEmail/VerifyEmail.jsx';
import ResetPassword from '/imports/ui/pages/Account/pages/ResetPassword/index.js';
import Construction from '/imports/ui/pages/Error/Construction.jsx';
import Forbidden from '/imports/ui/pages/Error/Forbidden.jsx';
import InternalError from '/imports/ui/pages/Error/InternalError.jsx';
import NotFound from '/imports/ui/pages/Error/NotFound.jsx';

import { platform } from '/imports/utils/utils.js';
import reducers from '/imports/ui/redux/reducers';

import { isLogin, isLogout, isOwner, isAllowVisitHome, isAllowVisitColl } from './policies.js';

const store = createStore(reducers);

const Root = () => {
  const isMobile = platform().mobile;
  if (!isMobile) return <PC />;
  return (
    <Provider store={store}>
      <MuiThemeProvider>
        <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
          <Route path="/" component={AppContainer}>
            <IndexRoute index={1} component={Index} />
            <Redirect from="explore" to="/" />
            <Route index={1} path="user/:username" component={User} onEnter={isAllowVisitHome} />
            <Route index={2} path="user/:username/likes" component={UserLikes} onEnter={isAllowVisitHome} />
            <Route index={2} path="user/:username/fans" component={UserFans} onEnter={isAllowVisitHome} />
            <Route index={1} path="user/:username/collection" component={AllCollections} onEnter={isAllowVisitColl} />
            <Route index={2} path="user/:username/collection/:cname" component={Colletion} onEnter={isAllowVisitColl} />
            <Route index={2} path="diary" component={Diary} onEnter={isLogin} />
            <Route index={3} path="diary/write" component={WriteDiary} onEnter={isLogin} />
            <Route index={2} path="recycle" component={Recycle} onEnter={isLogin} />
            <Route index={1} path="setting" component={Setting} onEnter={isLogin} />
            <Route index={2} path="setting/emails" component={SettingEmails} onEnter={isLogin} />
            <Route index={2} path="setting/password" component={SettingPassword} onEnter={isLogin} />
            <Route index={2} path="note/:username" component={Note} onEnter={isOwner} />
            <Route index={3} path="note/:username/sent" component={AllSentNotes} onEnter={isOwner} />
            <Route index={3} path="note/:username/received" component={AllNotes} onEnter={isOwner} />
            <Route index={2} path="sendNote" component={SendNote} onEnter={isLogin} />
            <Route index={2} path="search" component={Search} />
            <Route index={3} path="search/:query" component={SearchResults} />
            <Route index={1} path="accounts/verifyEmail" component={VerifyEmail} / >
            <Route index={1} path="accounts/resetPassword" component={ResetPassword} onEnter={isLogout} / >
            <Route index={1} path="login" component={Login} onEnter={isLogout} />
            <Route index={1} path="register" component={Register} onEnter={isLogout} />
            <Route index={1} path="memory" component={Construction} onEnter={isLogin} />
            <Route index={1} path="403" component={Forbidden} />
            <Route index={1} path="404" component={NotFound} />
            <Route index={1} path="500" component={InternalError} />
            <Route index={1} path="*" component={NotFound} />
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
