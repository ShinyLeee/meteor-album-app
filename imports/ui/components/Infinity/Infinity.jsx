import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { on, off } from '/imports/utils/events.js';

class Infinity extends Component {

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

Infinity.displayName = 'Infinity';

Infinity.defaultProps = {
  isLoading: false,
  offsetToBottom: 0,
  beforeInfinityLoad: (
    <div className="text-center">
      <CircularProgress
        color="#3F51B5"
        size={30}
        thickness={2.5}
      />
    </div>),
  onInfinityLoad: () => {},
};

Infinity.propTypes = {
  children: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  offsetToBottom: PropTypes.number,
  beforeInfinityLoad: PropTypes.node,
  onInfinityLoad: PropTypes.func.isRequired,
};

export default Infinity;
