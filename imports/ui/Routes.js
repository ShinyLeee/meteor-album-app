import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import {
  isLogin,
  isLogout,
  isOwner,
  isAllowVisitHome,
  isAllowVisitAllColl,
  isAllowVisitSpecColl,
} from '/imports/utils/policies';

import Login from './pages/Sign/pages/Login/Login.jsx';
import Register from './pages/Sign/pages/Register/Register.jsx';
import Index from './pages/Index/index.js';
import User from './pages/User/index.js';
import UserLikes from './pages/User/pages/UserLikes/index.js';
import UserFans from './pages/User/pages/UserFans/index.js';
import AllCollections from './pages/Collection/pages/AllCollections/index.js';
import Colletion from './pages/Collection/pages/Collection/index.js';
import Diary from './pages/Diary/pages/Diary/index.js';
import WriteDiary from './pages/Diary/pages/Write/index.js';
import Recycle from './pages/Recycle/index.js';
import Setting from './pages/Setting/pages/Setting/index.js';
import SettingEmails from './pages/Setting/pages/Emails/index.js';
import SettingPassword from './pages/Setting/pages/Password/index.js';
import Note from './pages/Note/pages/Note/index.js';
import AllSentNotes from './pages/Note/pages/AllSentNotes/index.js';
import AllNotes from './pages/Note/pages/AllNotes/index.js';
import SendNote from './pages/Note/pages/SendNote/index.js';
import Search from './pages/Search/pages/Search/index.js';
import SearchResults from './pages/Search/pages/Results/index.js';
import VerifyEmail from './pages/Account/pages/VerifyEmail/VerifyEmail.jsx';
import ResetPassword from './pages/Account/pages/ResetPassword/index.js';
import Construction from './pages/Error/Construction.jsx';
import Forbidden from './pages/Error/Forbidden.jsx';
import InternalError from './pages/Error/InternalError.jsx';
import NotFound from './pages/Error/NotFound.jsx';

let AuthRoute = (props) => {
  const { policy, ...rest } = props;
  const { isAuthenticated, redirect, state } = policy(rest);
  if (isAuthenticated) {
    return <Route {...rest} />;
  }
  return <Redirect to={{ pathname: redirect, state }} />;
};

AuthRoute.propTypes = {
  policy: PropTypes.func.isRequired,
};

AuthRoute = connect(
  (state) => ({ User: state.User })
)(AuthRoute);

const Routes = () => (
  <Switch>
    <Route path="/" component={Index} exact />
    <AuthRoute index={1} path="/user/:username" component={User} policy={isAllowVisitHome} exact />
    <AuthRoute index={2} path="/user/:username/likes" component={UserLikes} policy={isAllowVisitHome} />
    <AuthRoute index={2} path="/user/:username/fans" component={UserFans} policy={isAllowVisitHome} />
    <AuthRoute index={2} path="/user/:username/collection" component={AllCollections} policy={isAllowVisitAllColl} exact />
    <AuthRoute index={3} path="/user/:username/collection/:cname" component={Colletion} policy={isAllowVisitSpecColl} />
    <AuthRoute index={2} path="/diary" component={Diary} policy={isLogin} exact />
    <AuthRoute index={3} path="/diary/write" component={WriteDiary} policy={isLogin} />
    <AuthRoute index={2} path="/recycle" component={Recycle} policy={isLogin} />
    <AuthRoute index={2} path="/setting" component={Setting} policy={isLogin} />
    <AuthRoute index={3} path="/setting/emails" component={SettingEmails} policy={isLogin} />
    <AuthRoute index={3} path="/setting/password" component={SettingPassword} policy={isLogin} />
    <AuthRoute index={2} path="/note/:username" component={Note} policy={isOwner} exact />
    <AuthRoute index={3} path="/note/:username/sent" component={AllSentNotes} policy={isOwner} />
    <AuthRoute index={3} path="/note/:username/received" component={AllNotes} policy={isOwner} />
    <AuthRoute index={2} path="/sendNote" component={SendNote} policy={isLogin} />
    <AuthRoute index={1} path="/login" component={Login} policy={isLogout} />
    <AuthRoute index={1} path="/register" component={Register} policy={isLogout} />
    <Route index={2} path="/search" component={Search} exact />
    <Route index={3} path="/search/:query" component={SearchResults} />
    <Route index={1} path="/accounts/verifyEmail" component={VerifyEmail} / >
    <Route index={1} path="/accounts/resetPassword" component={ResetPassword} / >
    <Route index={1} path="/memory" component={Construction} />
    <Route index={1} path="/403" component={Forbidden} />
    <Route index={1} path="/404" component={NotFound} />
    <Route index={1} path="/500" component={InternalError} />
    <Route index={1} path="*" component={NotFound} />
    <Redirect path="explore" to="/" />
  </Switch>
);

export default Routes;
