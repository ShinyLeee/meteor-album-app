import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Store from '../../redux/store';
import { modalOpen, modalClose } from '../../redux/actions';
import ModalActions from './Common/ModalActions';
import ModalLoader from './Common/ModalLoader';

const isValidElement = (a) => React.isValidElement(a) || Array.isArray(a);

class Modal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    content: PropTypes.node,
    actions: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element,
    ]),
    // Dialog option props
    // More info: https://material-ui-1dab0.firebaseapp.com/api/dialog/
    ops: PropTypes.object,
    modalClose: PropTypes.func.isRequired,
  }

  static show(args) {
    return Store.dispatch(modalOpen(args));
  }

  static showPrompt(args) {
    Store.dispatch(modalOpen({
      title: '提示',
      content: args.message,
      actions: (
        <ModalActions
          onCancel={args.onCancel}
          onConfirm={args.onConfirm}
        />
      ),
    }));
  }

  static showLoader(message, errMsg) {
    return new Promise((resolve) => {
      Store.dispatch(modalOpen({
        content: <ModalLoader message={message} errMsg={errMsg} />,
        ops: { ignoreBackdropClick: true },
      }));
      setTimeout(resolve, 275);
    });
  }

  static close() {
    return Store.dispatch(modalClose());
  }

  _handleClose = () => {
    const onClose = get(this, 'props.ops.onClose');
    if (onClose) {
      onClose();
    } else {
      this.props.modalClose();
    }
  }

  render() {
    const { open, title, content, actions, ops } = this.props;
    return (
      <Dialog
        {...ops}
        open={open}
        onClose={this._handleClose}
      >
        { !!title && <DialogTitle>{title}</DialogTitle> }
        <DialogContent>
          {
            isValidElement(content)
            ? content
            : <DialogContentText>{content}</DialogContentText>
          }
        </DialogContent>
        { isValidElement(actions) && <DialogActions>{actions}</DialogActions> }
      </Dialog>
    );
  }
}

const mapStateToProps = ({ portals: { modal } }) => ({
  open: modal.open,
  title: modal.title,
  content: modal.content,
  actions: modal.actions,
  ops: modal.ops,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalClose,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Modal);
