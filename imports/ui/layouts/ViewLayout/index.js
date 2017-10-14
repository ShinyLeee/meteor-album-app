import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component } from 'react';
import { vHeight } from '/imports/utils/responsive';

export default class ViewLayout extends Component {
  static propTypes = {
    deep: PropTypes.bool,
    children: PropTypes.any,
    Topbar: PropTypes.element,
  }

  static defaultProps = {
    deep: false,
  }

  render() {
    const { deep, children, Topbar } = this.props;
    return (
      <div className="container">
        { Topbar }
        <main
          className={classNames('content', { deep })}
          style={{ minHeight: vHeight - 64 }}
        >
          { children }
        </main>
      </div>
    );
  }
}
