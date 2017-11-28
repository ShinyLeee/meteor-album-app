import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GetHeightWrapper extends Component {
  static propTypes = {
    getHeight: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  componentDidMount() {
    this.setHeight();
  }

  shouldComponentUpdate() {
    return false;
  }

  setHeight = () => {
    const { height } = this._node.getBoundingClientRect();
    this.props.getHeight(height);
  }

  render() {
    return (
      <div ref={node => { this._node = node; }}>
        {this.props.children}
      </div>
    );
  }
}
