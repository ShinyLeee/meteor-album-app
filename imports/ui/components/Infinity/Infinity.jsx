import React, { Component, PropTypes } from 'react';
import pure from 'recompose/pure';
import CircularProgress from 'material-ui/CircularProgress';
import { on, off } from '/imports/utils/events.js';

class Infinity extends Component {

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    on(window, 'scroll', this.handleScroll);
  }

  componentWillUnmount() {
    off(window, 'scroll', this.handleScroll);
  }

  handleScroll() {
    const offset = document.body.scrollHeight - (window.innerHeight + window.scrollY);
    const { offsetToBottom, onInfinityLoad, isLoading } = this.props;
    if (offset <= offsetToBottom && !isLoading) {
      onInfinityLoad();
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
        {this.props.isLoading ?
          <div className={this.props.loadSpinnerClassName}>
            {this.props.beforeInfinityLoad}
          </div> : null }
      </div>
    );
  }
}

Infinity.displayName = 'Infinity';

Infinity.defaultProps = {
  isLoading: false,
  offsetToBottom: 0,
  className: 'component__Infinity',
  loadSpinnerClassName: 'Infinity__spinner',
  beforeInfinityLoad: (<div className="text-center"><CircularProgress /></div>),
  onInfinityLoad: () => {},
};

Infinity.propTypes = {
  children: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  offsetToBottom: PropTypes.number,
  className: PropTypes.string,
  loadSpinnerClassName: PropTypes.string,
  beforeInfinityLoad: PropTypes.node,
  onInfinityLoad: PropTypes.func.isRequired,
};

export default pure(Infinity);
