import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import { snackBarClose } from '/imports/ui/redux/actions/actionTypes.js';

class SnackBar extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      open: false,
      message: '',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        open: nextProps.open,
        message: nextProps.message,
      });
    } else {
      const open = nextProps.open;
      clearTimeout(this.autoHideTimer);
      this.setState({
        open: open !== null ? open : this.state.open,
        message: nextProps.message,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.open !== this.state.open) {
      if (this.state.open) {
        this.setAutoHideTimer();
      }
    }
  }

  setAutoHideTimer() {
    const { dispatch, autoHideDuration } = this.props;
    this.autoHideTimer = setTimeout(() => {
      dispatch(snackBarClose());
    }, autoHideDuration);
  }

  renderDefault() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={this.props.autoHideDuration}
      />
    );
  }

  renderCustom() {
    const { autoHideDuration, config } = this.props;
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={autoHideDuration}
        action={config.action}
        style={config.style}
        bodyStyle={config.bodyStyle}
        contentStyle={config.contentStyle}
        onActionTouchTap={config.onActionTouchTap}
        onRequestClose={config.onRequestClose}
      />
    );
  }

  render() {
    const { config } = this.props;
    return (
      <div>
        { config ? this.renderCustom() : this.renderDefault() }
      </div>
    );
  }
}

SnackBar.defaultProps = {
  open: false,
  autoHideDuration: 2500,
};

SnackBar.propTypes = {
  dispatch: PropTypes.func,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  autoHideDuration: PropTypes.number.isRequired,
  /**
   * config
   *
   * @param {object} props: All Snackbar props except
   * open、message and autoHideDuration
   *
   * See http://www.material-ui.com/#/components/snackbar
   */
  config: PropTypes.object,
};

const mapStateToProps = (state) => {
  const snackBar = state.snackBar;
  if (snackBar) {
    return {
      open: snackBar.open,
      message: snackBar.message,
      config: snackBar.config,
    };
  }
  return { open: false, message: '' };
};

export default connect(mapStateToProps)(SnackBar);
