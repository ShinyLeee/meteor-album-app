import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { modalClose } from '../../redux/actions';


const isValidElement = (a) => React.isValidElement(a) || Array.isArray(a);

class Modal extends PureComponent {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.element,
    ]),
    actions: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.element,
    ]),
    ops: PropTypes.object,
    classes: PropTypes.object.isRequired,
    modalClose: PropTypes.func.isRequired,
  }

  _handleRequestClose = () => {
    const onRequestClose = _.get(this, 'props.ops.onRequestClose');
    if (onRequestClose) {
      onRequestClose();
    } else {
      this.props.modalClose();
    }
  }

  render() {
    const { open, title, content, actions, ops, classes } = this.props;
    return (
      <Dialog
        classes={{ paper: classes.dialog }}
        {...ops}
        open={open}
        onRequestClose={this._handleRequestClose}
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

const styles = {
  dialog: {
    width: '75%',
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Modal);
