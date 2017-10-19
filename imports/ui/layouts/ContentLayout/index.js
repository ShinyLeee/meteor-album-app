import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import CircleLoader from '/imports/ui/components/Loader/CircleLoader';
import LinearLoader from '/imports/ui/components/Loader/LinearLoader';
import { vHeight } from '/imports/utils/responsive';

export default class ContentLayout extends Component {
  static propTypes = {
    deep: PropTypes.bool,
    loading: PropTypes.bool,
    loadingStyle: PropTypes.object,
    loadingType: PropTypes.oneOf(['Circle', 'Linear']),
    content: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.element,
    ]),
    topbarHeight: PropTypes.number,
    children: PropTypes.any,
  }

  static defaultProps = {
    deep: false,
    loading: false,
    loadingStyle: null,
    loadingType: 'Linear',
    content: false,
    topbarHeight: 64,
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
    const { deep, content, topbarHeight, children } = this.props;
    return (
      <main
        className={classNames('content', { deep })}
        style={{ minHeight: vHeight - topbarHeight }}
      >
        { this.renderLoader() }
        { content || children }
      </main>
    );
  }
}
