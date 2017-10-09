import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';

class Loader extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
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
        <CircularProgress
          classes={{ root: classes.progress, circle: classes.circle }}
          size={30}
        />
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

  progress: {
    color: 'rgb(63, 81, 181)',
    marginRight: 36,
  },

  circle: {
    strokeWidth: 2.5,
  },

  message: {
    fontSize: 14,
    color: '#222',
  },
};

export default withStyles(styles)(Loader);
