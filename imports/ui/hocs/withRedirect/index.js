import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default function withRedirect(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      location: PropTypes.object.isRequired,
      snackBarOpen: PropTypes.func.isRequired,
    }

    componentDidMount() {
      const { location, snackBarOpen } = this.props;
      if (
        location.state !== undefined &&
        location.state.message !== undefined
      ) {
        snackBarOpen(location.state.message);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
