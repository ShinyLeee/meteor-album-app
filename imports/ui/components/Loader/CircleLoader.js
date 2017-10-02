import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Dialog from 'material-ui/Dialog';
import { LoaderContent, LoaderProgress, LoaderMessage } from './Loader.style.js';

export default class Loader extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    timeout: PropTypes.number.isRequired,
    onTimeout: PropTypes.func,
  }

  static defaultProps = {
    open: false,
    message: '加载中',
    timeout: 5000,
  }

  state = {
    open: this.props.open,
    message: this.props.message,
  }

  componentDidMount() {
    if (this.state.open) {
      this.setTimeoutTimer();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({ open: nextProps.open, message: nextProps.message });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) this.setTimeoutTimer();
      else clearTimeout(this.timeoutFn);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutFn);
  }

  setTimeoutTimer() {
    const { timeout } = this.props;

    if (timeout > 0) {
      this.timeoutFn = setTimeout(() => {
        if (this.props.onTimeout) this.props.onTimeout();
        this.setState({ open: false, message: '' });
      }, timeout);
    }
  }

  render() {
    return this.state.open && (
      <div>
        <Dialog
          open={this.state.open}
          modal
        >
          <LoaderContent>
            <LoaderProgress>
              <CircularProgress size={30} />
            </LoaderProgress>
            <LoaderMessage>{this.state.message}</LoaderMessage>
          </LoaderContent>
        </Dialog>
      </div>
    );
  }
}
