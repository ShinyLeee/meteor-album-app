import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { PageLoader } from '/imports/ui/components/Loader';

class AuthRoute extends Component {
  static propTypes = {
    policy: PropTypes.func.isRequired,
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
    ]).isRequired,
  }

  state = {
    isAuthenticated: false,
    redirect: false,
  }

  componentDidMount() {
    this.props.policy((res) => {
      if (res.isAuthenticated) {
        this.setState({ isAuthenticated: true });
      } else {
        // return <Redirect to={{ pathname: res.redirect, state: res.state }} />;
        this.setState({ redirect: true });
      }
    });
  }

  render() {
    const { component: Element } = this.props;
    if (this.state.isAuthenticated) {
      return <Route render={props => <Element {...props} />} />;
    }
    if (this.state.redirect) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
    return <PageLoader />;
  }
}

export default connect(
  ({ sessions }) => ({ User: sessions.User }),
)(AuthRoute);
