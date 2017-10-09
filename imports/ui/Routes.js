import PropTypes from 'prop-types';
import React from 'react';
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

import { Login, Register } from './pages/Sign';
import Index from './pages/Index';
import User, { UserLikes, UserFans } from './pages/User';
import Collection, { CollectionAll } from './pages/Collection';
import Diary, { DiaryWrite } from './pages/Diary';
import Recycle from './pages/Recycle';
import Setting, { SettingEmails, SettingPassword } from './pages/Setting';
import Note, { NoteAllSent, NoteAll, NoteSend } from './pages/Note';
import Search, { SearchResults } from './pages/Search';
import { VerifyEmail, ResetPassword } from './pages/Account';
import { Construction, Forbidden, InternalError, NotFound } from './pages/Error';

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
  ({ sessions }) => ({ User: sessions.User })
)(AuthRoute);

const Routes = () => (
  <Switch>
    <Route path="/" component={Index} exact />
    <AuthRoute index={1} path="/user/:username" component={User} policy={isAllowVisitHome} exact />
    <AuthRoute index={2} path="/user/:username/likes" component={UserLikes} policy={isAllowVisitHome} />
    <AuthRoute index={2} path="/user/:username/fans" component={UserFans} policy={isAllowVisitHome} />
    <AuthRoute index={2} path="/user/:username/collection" component={CollectionAll} policy={isAllowVisitAllColl} exact />
    <AuthRoute index={3} path="/user/:username/collection/:cname" component={Collection} policy={isAllowVisitSpecColl} />
    <AuthRoute index={2} path="/diary" component={Diary} policy={isLogin} exact />
    <AuthRoute index={3} path="/diary/write" component={DiaryWrite} policy={isLogin} />
    <AuthRoute index={2} path="/recycle" component={Recycle} policy={isLogin} />
    <AuthRoute index={2} path="/setting" component={Setting} policy={isLogin} exact />
    <AuthRoute index={3} path="/setting/emails" component={SettingEmails} policy={isLogin} />
    <AuthRoute index={3} path="/setting/password" component={SettingPassword} policy={isLogin} />
    <AuthRoute index={2} path="/note/:username" component={Note} policy={isOwner} exact />
    <AuthRoute index={3} path="/note/:username/sent" component={NoteAllSent} policy={isOwner} />
    <AuthRoute index={3} path="/note/:username/received" component={NoteAll} policy={isOwner} />
    <AuthRoute index={2} path="/sendNote" component={NoteSend} policy={isLogin} />
    <AuthRoute index={1} path="/login" component={Login} policy={isLogout} />
    <AuthRoute index={1} path="/register" component={Register} policy={isLogout} />
    <AuthRoute index={1} path="/accounts/resetPassword" component={ResetPassword} policy={isLogout} / >
    <Route index={1} path="/accounts/verifyEmail" component={VerifyEmail} / >
    <Route index={2} path="/search" component={Search} exact />
    <Route index={3} path="/search/:query" component={SearchResults} />
    <Route index={1} path="/memory" component={Construction} />
    <Route index={1} path="/403" component={Forbidden} />
    <Route index={1} path="/404" component={NotFound} />
    <Route index={1} path="/500" component={InternalError} />
    <Route index={1} path="*" component={NotFound} />
    <Redirect path="explore" to="/" />
  </Switch>
);

export default Routes;
