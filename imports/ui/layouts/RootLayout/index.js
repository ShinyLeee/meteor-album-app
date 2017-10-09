import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { vHeight } from '/imports/utils/responsive';
import { LinearLoader } from '/imports/ui/components/Loader';

class RootLayout extends Component {
  static propTypes = {
    isAppReady: PropTypes.bool.isRequired,
    User: PropTypes.object,
    deep: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    children: PropTypes.any,
    Topbar: PropTypes.element,
  }

  static defaultProps = {
    deep: false,
    loading: true,
  }

  render() {
    const { deep, loading, children, Topbar, isAppReady } = this.props;
    const isLoading = !isAppReady || loading;
    return (
      <div className="container">
        { Topbar }
        <main
          className={classNames('content', { deep })}
          style={{ minHeight: vHeight - 64 }}
        >
          { isLoading && <LinearLoader /> }
          { children }
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({ sessions }) => ({
  isAppReady: !sessions.initializing,
});

export default connect(mapStateToProps)(RootLayout);
