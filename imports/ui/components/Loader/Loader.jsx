import React, { Component, PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';

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

  componentWillUnmount() {
    clearTimeout(this.timeoutFn);
  }

  setTimeoutTimer() {
    const { timeout } = this.props;

    if (timeout > 0) {
      this.timeoutFn = setTimeout(() => {
        this.props.onTimeout();
        this.setState({ open: false });
      }, timeout);
    }
  }

  render() {
    return this.state.open && (
      <div className="component__Loader">
        <Dialog
          open={this.state.open}
          modal
        >
          <div className="Loader__content">
            <div className="Loader__progress">
              <CircularProgress
                color="#3F51B5"
                size={30}
                thickness={2.5}
              />
            </div>
            <div className="Loader__message">{this.props.message}</div>
          </div>
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
