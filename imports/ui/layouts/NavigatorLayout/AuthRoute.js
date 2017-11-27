import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { fetchAuth } from '/imports/ui/redux/actions';

// const policyHandler = (policy, args) => {
//   let ret;
//   if (typeof policy === 'function') {
//     ret = policy(args);
//   } else if (Array.isArray(policy)) {
//     policy.every((fn, i) => {
//       console.log(i);
//       ret = fn(args);
//       // break loop if authentication failed
//       if (!ret.isAuthenticated) {
//         return false;
//       }
//       // continue loop
//       return true;
//     });
//   }
//   return ret;
// };

class AuthRoute extends Component {
  static propTypes = {
    policy: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
    ]).isRequired,
    location: PropTypes.object.isRequired,
    fetchAuth: PropTypes.func.isRequired,
  }

  async componentDidMount() {
    const { policy, ...rest } = this.props;
    // console.log('fetch auth didmount');
    await this.props.fetchAuth(policy, rest);
  }

  shouldComponentUpdate(next) {
    const prev = this.props;
    const prevUrl = prev.location.pathname + prev.location.search;
    const nextUrl = next.location.pathname + next.location.search;
    return prevUrl !== nextUrl;
  }

  async componentDidUpdate(prevProps) {
    const { policy, ...rest } = this.props;
    if (prevProps.location.pathname !== this.props.location.pathname) {
      // console.log('fetch auth didupdate');
      await this.props.fetchAuth(policy, rest);
    }
  }

  render() {
    const { location, ...rest } = this.props;
    return <Route {...rest} />;
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchAuth,
}, dispatch);

export default connect(null, mapDispatchToProps)(AuthRoute);
