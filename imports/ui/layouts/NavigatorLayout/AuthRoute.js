import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = (props) => {
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

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(AuthRoute);
