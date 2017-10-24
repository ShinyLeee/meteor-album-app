import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import Portal from '../Portal';
import { snackBarClose } from '../../redux/actions';

class SnackBar extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
    autoHideDuration: PropTypes.number,
    snackBarClose: PropTypes.func.isRequired,
    /**
     * config
     *
     * @param {object} props: All Snackbar props except
     * open、message and autoHideDuration
     *
     * See https://material-ui-1dab0.firebaseapp.com/api/snackbar/
     */
    config: PropTypes.object,
  }

  static defaultProps = {
    autoHideDuration: 2500,
  }

  state = {
    open: false,
    message: null,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        open: nextProps.open,
        message: nextProps.message,
      });
    }
  }

  _handleRequestClose = () => {
    this.props.snackBarClose();
  }

  renderDefault() {
    const { autoHideDuration } = this.props;
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={autoHideDuration}
        onRequestClose={this._handleRequestClose}
        onExited={this._handleRequestClose}
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
        {...config}
      />
    );
  }

  render() {
    const { config } = this.props;
    return (
      <Portal name="SnackBar">
        { config ? this.renderCustom() : this.renderDefault() }
      </Portal>
    );
  }
}

const mapStateToProps = ({ portals }) => ({
  open: portals.snackBar.open,
  message: portals.snackBar.message,
  config: portals.snackBar.config,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarClose,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);

