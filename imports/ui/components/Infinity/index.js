import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { on, off } from '/imports/utils/events.js';

export default class Infinity extends Component {
  static propTypes = {
    children: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    offsetToBottom: PropTypes.number,
    beforeInfinityLoad: PropTypes.node,
    onInfinityLoad: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isLoading: false,
    offsetToBottom: 0,
    beforeInfinityLoad: (
      <div className="text-center">
        <CircularProgress size={30} />
      </div>
    ),
    onInfinityLoad: () => {},
  }

  constructor(props) {
    super(props);
    this.scrollHandler = _.debounce(this.handleScroll.bind(this), 300);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    on(window, 'scroll', this.scrollHandler);
  }

  componentWillUnmount() {
    this._isMounted = false;
    off(window, 'scroll', this.scrollHandler);
  }

  handleScroll() {
    if (this._isMounted) {
      const offset = document.body.scrollHeight - (window.innerHeight + window.scrollY);
      const { offsetToBottom, onInfinityLoad, isLoading } = this.props;
      if (offset <= offsetToBottom && !isLoading) {
        onInfinityLoad();
      }
    }
  }

  render() {
    const { children, isLoading, beforeInfinityLoad } = this.props;
    return (
      <div>
        {children}
        { isLoading && (
          <div>
            {beforeInfinityLoad}
          </div>)
        }
      </div>
    );
  }
}
