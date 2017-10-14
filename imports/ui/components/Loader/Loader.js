import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import CircleLoader from './CircleLoader';

class Loader extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
    timeout: PropTypes.number,
    onTimeout: PropTypes.func,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
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
      if (this.state.open) {
        this.setTimeoutTimer();
      } else {
        clearTimeout(this.timeoutFn);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutFn);
  }

  setTimeoutTimer() {
    const { timeout } = this.props;

    if (timeout > 0) {
      this.timeoutFn = setTimeout(() => {
        if (this.props.onTimeout) {
          this.props.onTimeout();
        }
        this.setState({ open: false, message: '' });
      }, timeout);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        classes={{ paper: classes.dialog }}
        open={this.state.open}
      >
        <CircleLoader />
        <p className={classes.message}>{this.state.message}</p>
      </Dialog>
    );
  }
}

const styles = {
  dialog: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '75%',
    height: 88,
  },

  message: {
    fontSize: 14,
    color: '#222',
  },
};

export default withStyles(styles)(Loader);
