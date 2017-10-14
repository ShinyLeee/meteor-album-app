import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { CircleLoader, LinearLoader } from '/imports/ui/components/Loader';
import { vHeight } from '/imports/utils/responsive';

export default class ContentLayout extends Component {
  static propTypes = {
    deep: PropTypes.bool,
    loading: PropTypes.bool,
    loadingStyle: PropTypes.object,
    loadingType: PropTypes.oneOf(['Circle', 'Linear']),
    children: PropTypes.any,
  }

  static defaultProps = {
    deep: false,
    loading: false,
    loadingStyle: null,
    loadingType: 'Linear',
  }

  renderLoader() {
    // TODO add delay option
    const { loading, loadingStyle, loadingType } = this.props;
    if (loading) {
      return loadingType === 'Linear'
        ? <LinearLoader style={loadingStyle} />
        : <div className="text-center"><CircleLoader style={loadingStyle} /></div>;
    }
    return null;
  }

  render() {
    const { deep, children } = this.props;
    return (
      <main
        className={classNames('content', { deep })}
        style={{ minHeight: vHeight - 64 }}
      >
        { this.renderLoader() }
        { children }
      </main>
    );
  }
}
