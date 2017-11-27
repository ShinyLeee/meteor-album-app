import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import RecoveryIcon from 'material-ui-icons/Replay';
import RemoveIcon from 'material-ui-icons/Delete';
import { removeImages, recoveryImages } from '/imports/api/images/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Modal from '/imports/ui/components/Modal';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncRecycleContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class RecyclePage extends PureComponent {
  static propTypes = {
    selectImages: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isEditing: false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isEditing: !!nextProps.counter });
  }

  _handleRecovery = async () => {
    try {
      const { selectImages } = this.props;
      await Modal.showLoader('恢复相片中');
      await recoveryImages.callPromise({
        selectImages: selectImages.map((image) => image._id),
      });
      Modal.close();
      this.props.snackBarOpen('恢复相片成功');
      this.props.disableSelectAll();
    } catch (err) {
      Modal.close();
      this.props.snackBarOpen(`恢复相片失败 ${err.reason}`);
    }
  }

  _handleDelete = async () => {
    try {
      const { selectImages } = this.props;
      await Modal.showLoader('删除相片中');
      await Meteor.callPromise('Qiniu.remove', {
        keys: selectImages.map((image) => `${image.user}/${image.collection}/${image.name}.${image.type}`),
      });
      await removeImages.callPromise({
        selectImages: selectImages.map((image) => image._id),
      });
      Modal.close();
      this.props.snackBarOpen('删除相片成功');
      this.props.disableSelectAll();
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
    }
  }

  renderPrompt(type) {
    const { selectImages } = this.props;
    if (selectImages.length === 0) {
      this.props.snackBarOpen('您尚未选择相片');
      return;
    }

    const isRecovery = type === 'recovery';
    Modal.showPrompt({
      message: isRecovery ? '是否确认恢复所选照片' : '是否确认彻底删除所选照片？',
      onCancel: Modal.close,
      onConfirm: isRecovery ? this._handleRecovery : this._handleDelete,
    });
  }

  render() {
    const { counter } = this.props;
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            title={counter ? `选择了${counter}张照片` : '回收站'}
            Left={this.state.isEditing && (
              <IconButton
                color="contrast"
                onClick={this.props.disableSelectAll}
              ><CloseIcon />
              </IconButton>
            )}
            Right={[
              <IconButton
                key="btn__Recovery"
                color="contrast"
                onClick={() => this.renderPrompt('recovery')}
              ><RecoveryIcon />
              </IconButton>,
              <IconButton
                key="btn__delete"
                color="contrast"
                onClick={() => this.renderPrompt('delete')}
              ><RemoveIcon />
              </IconButton>,
            ]}
          />
        }
      >
        <AsyncRecycleContent />
      </ViewLayout>
    );
  }
}
