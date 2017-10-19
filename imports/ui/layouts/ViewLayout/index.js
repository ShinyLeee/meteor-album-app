import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ViewLayout extends Component {
  static propTypes = {
    Topbar: PropTypes.element,
    children: PropTypes.any,
  }

  render() {
    const { Topbar, children } = this.props;
    return (
      <div className="container">
        { Topbar }
        { children }
      </div>
    );
  }
}
