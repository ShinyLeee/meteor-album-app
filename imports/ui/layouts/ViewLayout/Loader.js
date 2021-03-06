import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LinearLoader from '/imports/ui/components/Loader/LinearLoader';
import DataLoader from '/imports/ui/components/Loader/DataLoader';

class GlobalLoader extends Component {
  static propTypes = {
    delay: PropTypes.number,
    loadingStyle: PropTypes.object,
    loadingType: PropTypes.oneOf(['Circle', 'Linear']),
    isFetchingAuth: PropTypes.bool.isRequired,
    isFetchingModule: PropTypes.bool.isRequired,
    isFetchingData: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    delay: 200,
    loadingType: 'Linear',
  }

  constructor(props) {
    super(props);
    this.state = {
      pastDelay: false,
    };
  }

  componentWillMount() {
    this._delayTimeout = setTimeout(
      () => this.setState({ pastDelay: true }),
      this.props.delay,
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    const prev = this.props.isFetchingAuth || this.props.isFetchingModule || this.props.isFetchingData;
    const next = nextProps.isFetchingAuth || nextProps.isFetchingModule || nextProps.isFetchingData;
    return prev !== next ||
    this.state.pastDelay !== nextState.pastDelay;
  }

  componentWillUnmount() {
    clearTimeout(this._delayTimeout);
  }

  render() {
    const {
      loadingStyle,
      loadingType,
      isFetchingAuth,
      isFetchingModule,
      isFetchingData,
    } = this.props;
    if (
      this.state.pastDelay &&
      (isFetchingAuth || isFetchingModule || isFetchingData)
    ) {
      return loadingType === 'Linear'
        ? <LinearLoader key="LinearLoader" style={loadingStyle} />
        : <DataLoader />;
    }
    return null;
  }
}

const mapStateToProps = ({ sessions, modules }) => ({
  isFetchingAuth: sessions.auth.isFetching,
  isFetchingModule: modules.loading,
  isFetchingData: sessions.isFetchingData,
});

export default connect(mapStateToProps)(GlobalLoader);

