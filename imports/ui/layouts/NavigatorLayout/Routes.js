import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import {
  isLogin,
  isLogout,
  isOwner,
  isAllowVisitHome,
  isAllowVisitAllColl,
  isAllowVisitSpecColl,
} from '/imports/utils/policies';

import IndexPage from '/imports/ui/pages/Index';
import UserPage, { UserLikesPage, UserFansPage } from '/imports/ui/pages/User';
import CollectionPage, { AllCollectionsPage } from '/imports/ui/pages/Collection';
import DiaryPage, { DiaryWritePage } from '/imports/ui/pages/Diary';
import RecyclePage from '/imports/ui/pages/Recycle';
import SettingPage, { SettingEmailsPage, SettingPasswordPage } from '/imports/ui/pages/Setting';
import NotesPage, { AllSentNotesPage, AllNotesPage, SendNotePage } from '/imports/ui/pages/Note';
import { LoginPage, RegisterPage } from '/imports/ui/pages/Sign';
import { ResetPasswordPage, VerifyEmailPage } from '/imports/ui/pages/Account';
import SearchPage, { SearchResultsPage } from '/imports/ui/pages/Search';
import { ConstructionPage, ForbiddenPage, InternalErrorPage, NotFoundPage } from '/imports/ui/pages/Error';

import AuthRoute from './AuthRoute';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={IndexPage} exact />
      <AuthRoute path="/user/:username" component={UserPage} policy={isAllowVisitHome} exact />
      <AuthRoute path="/user/:username/likes" component={UserLikesPage} policy={isAllowVisitHome} />
      <AuthRoute path="/user/:username/fans" component={UserFansPage} policy={isAllowVisitHome} />
      <AuthRoute path="/user/:username/collection" component={AllCollectionsPage} policy={isAllowVisitAllColl} exact />
      <AuthRoute path="/user/:username/collection/:cname" component={CollectionPage} policy={isAllowVisitSpecColl} />
      <AuthRoute path="/diary" component={DiaryPage} policy={isLogin} exact />
      <AuthRoute path="/diary/write" component={DiaryWritePage} policy={isLogin} />
      <AuthRoute path="/recycle" component={RecyclePage} policy={isLogin} />
      <AuthRoute path="/setting" component={SettingPage} policy={isLogin} exact />
      <AuthRoute path="/setting/emails" component={SettingEmailsPage} policy={isLogin} />
      <AuthRoute path="/setting/password" component={SettingPasswordPage} policy={isLogin} />
      <AuthRoute path="/note/:username" component={NotesPage} policy={isOwner} exact />
      <AuthRoute path="/note/:username/sent" component={AllSentNotesPage} policy={isOwner} />
      <AuthRoute path="/note/:username/received" component={AllNotesPage} policy={isOwner} />
      <AuthRoute path="/sendNote" component={SendNotePage} policy={isLogin} />
      <Route path="/login" component={LoginPage} policy={isLogout} />
      <AuthRoute path="/register" component={RegisterPage} policy={isLogout} />
      <AuthRoute path="/accounts/resetPassword" component={ResetPasswordPage} policy={isLogout} />
      <Route path="/accounts/verifyEmail" component={VerifyEmailPage} />
      <Route path="/search" component={SearchPage} exact />
      <Route path="/search/:query" component={SearchResultsPage} />
      <Route path="/memory" component={ConstructionPage} />
      <Route path="/403" component={ForbiddenPage} />
      <Route path="/404" component={NotFoundPage} />
      <Route path="/500" component={InternalErrorPage} />
      <Route path="*" component={NotFoundPage} />
      <Redirect path="explore" to="/" />
    </Switch>
  );
}
