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

import UserPage from '/imports/ui/pages/User/pages/User';

import withLoadable from '../../hocs/withLoadable';

// import AuthRoute from './AuthRoute';

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
  ({ sessions }) => ({ User: sessions.User }),
)(AuthRoute);

export default function Routes() {
  return (
    <Switch>
      <Route
        path="/"
        component={withLoadable({ loader: () => import('../../pages/Index') })}
        exact
      />
      <AuthRoute
        path="/user/:username"
        component={UserPage}
        policy={isAllowVisitHome}
        exact
      />
      <AuthRoute
        path="/user/:username/likes"
        component={withLoadable({ loader: () => import('../../pages/User/pages/UserLikes') })}
        policy={isAllowVisitHome}
      />
      <AuthRoute
        path="/user/:username/fans"
        component={withLoadable({ loader: () => import('../../pages/User/pages/UserFans') })}
        policy={isAllowVisitHome}
      />
      <AuthRoute
        path="/user/:username/collection"
        component={withLoadable({ loader: () => import('../../pages/Collection/pages/AllCollections') })}
        policy={isAllowVisitAllColl}
        exact
      />
      <AuthRoute
        path="/user/:username/collection/:cname"
        component={withLoadable({ loader: () => import('../../pages/Collection/pages/Collection') })}
        policy={isAllowVisitSpecColl}
      />
      <AuthRoute
        path="/diary"
        component={withLoadable({ loader: () => import('../../pages/Diary/pages/Diary') })}
        policy={isLogin}
        exact
      />
      <AuthRoute
        path="/diary/write"
        component={withLoadable({ loader: () => import('../../pages/Diary/pages/Write') })}
        policy={isLogin}
      />
      <AuthRoute
        path="/recycle"
        component={withLoadable({ loader: () => import('../../pages/Recycle') })}
        policy={isLogin}
      />
      <AuthRoute
        path="/setting"
        component={withLoadable({ loader: () => import('../../pages/Setting/pages/Setting') })}
        policy={isLogin}
        exact
      />
      <AuthRoute
        path="/setting/emails"
        component={withLoadable({ loader: () => import('../../pages/Setting/pages/Emails') })}
        policy={isLogin}
      />
      <AuthRoute
        path="/setting/password"
        component={withLoadable({ loader: () => import('../../pages/Setting/pages/Password') })}
        policy={isLogin}
      />
      <AuthRoute
        path="/note/:username"
        component={withLoadable({ loader: () => import('../../pages/Note/pages/Note') })}
        policy={isOwner}
        exact
      />
      <AuthRoute
        path="/note/:username/sent"
        component={withLoadable({ loader: () => import('../../pages/Note/pages/AllSentNotes') })}
        policy={isOwner}
      />
      <AuthRoute
        path="/note/:username/received"
        component={withLoadable({ loader: () => import('../../pages/Note/pages/AllNotes') })}
        policy={isOwner}
      />
      <AuthRoute
        path="/sendNote"
        component={withLoadable({ loader: () => import('../../pages/Note/pages/SendNote') })}
        policy={isLogin}
      />
      <Route
        path="/login"
        component={withLoadable({ loader: () => import('../../pages/Sign/pages/Login') })}
        policy={isLogout}
      />
      <AuthRoute
        path="/register"
        component={withLoadable({ loader: () => import('../../pages/Sign/pages/Register') })}
        policy={isLogout}
      />
      <AuthRoute
        path="/accounts/resetPassword"
        component={withLoadable({ loader: () => import('../../pages/Account/pages/ResetPassword') })}
        policy={isLogout}
      />
      <Route
        path="/accounts/verifyEmail"
        component={withLoadable({ loader: () => import('../../pages/Account/pages/VerifyEmail') })}
      />
      <Route
        path="/search"
        component={withLoadable({ loader: () => import('../../pages/Search/pages/Search') })}
        exact
      />
      <Route
        path="/search/:query"
        component={withLoadable({ loader: () => import('../../pages/Search/pages/Results') })}
      />
      <Route
        path="/memory"
        component={withLoadable({ loader: () => import('../../pages/Error/Construction') })}
      />
      <Route
        path="/403"
        component={withLoadable({ loader: () => import('../../pages/Error/Forbidden') })}
      />
      <Route
        path="/404"
        component={withLoadable({ loader: () => import('../../pages/Error/NotFound') })}
      />
      <Route
        path="/500"
        component={withLoadable({ loader: () => import('../../pages/Error/InternalError') })}
      />
      <Route
        path="*"
        component={withLoadable({ loader: () => import('../../pages/Error/NotFound') })}
      />
      <Redirect
        path="explore"
        to="/"
      />
    </Switch>
  );
}
