import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const portals = document.getElementById('portals');

export default class Portal extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.any.isRequired,
  }

  constructor(props) {
    super(props);
    const name = props.name || this.getDisplayName();
    this._ele = document.createElement('div');
    this._ele.setAttribute(`data-portal-${name}`, true);
  }

  componentDidMount() {
    portals.appendChild(this._ele);
  }

  componentWillUnmount() {
    portals.removeChild(this._ele);
  }

  getDisplayName() {
    const regex = /\((.+)\)/;
    let displayName = _.get(this.props, 'children.type.displayName') || 'Unknown';
    displayName = displayName.match(regex) ? displayName.match(regex)[1] : displayName;
    return displayName;
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this._ele,
    );
  }
}
