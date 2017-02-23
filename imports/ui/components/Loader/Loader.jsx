import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import { LoaderContent, LoaderProgress, LoaderMessage } from './styled.js';

export default class Loader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      message: props.message,
    };
  }

  componentDidMount() {
    if (this.state.open) {
      this.setTimeoutTimer();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({ open: nextProps.open, message: nextProps.message });
    } else {
      clearTimeout(this.timeoutFn);
      this.setState({ open: nextProps.open, message: nextProps.message });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) {
        this.setTimeoutTimer();
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
        if (this.props.onTimeout) this.props.onTimeout();
        this.setState({ open: false });
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
              <CircularProgress
                color="#3F51B5"
                size={30}
                thickness={2.5}
              />
            </LoaderProgress>
            <LoaderMessage>{this.props.message}</LoaderMessage>
          </LoaderContent>
        </Dialog>
      </div>
    );
  }
}

Loader.displayName = 'Loader';

Loader.defaultProps = {
  open: false,
  message: '加载中',
  timeout: 5000,
};

Loader.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
  onTimeout: PropTypes.func,
};
