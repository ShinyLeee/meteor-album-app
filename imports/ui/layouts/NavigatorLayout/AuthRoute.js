import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const policyHandler = (policy, args) => {
  let ret;
  if (typeof policy === 'function') {
    ret = policy(args);
  } else if (Array.isArray(policy)) {
    policy.every((fn, i) => {
      console.log(i);
      ret = fn(args);
      // break loop if authentication failed
      if (!ret.isAuthenticated) {
        return false;
      }
      // continue loop
      return true;
    });
  }
  return ret;
};

const AuthRoute = (props) => {
  const { policy, ...rest } = props;
  const { isAuthenticated, redirect, state } = policy(rest);
  if (isAuthenticated) {
    return <Route {...rest} />;
  }
  return <Redirect to={{ pathname: redirect, state }} />;
};

AuthRoute.propTypes = {
  policy: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
  ]).isRequired,
};

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

export default connect(mapStateToProps)(AuthRoute);
