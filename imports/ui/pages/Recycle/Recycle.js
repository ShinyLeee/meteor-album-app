import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import RecoveryIcon from 'material-ui-icons/Replay';
import RemoveIcon from 'material-ui-icons/Delete';
import blue from 'material-ui/colors/blue';
import purple from 'material-ui/colors/purple';
import { removeImages, recoveryImages } from '/imports/api/images/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import { ModalActions, ModalLoader } from '/imports/ui/components/Modal';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncRecycleContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

const blue500 = blue['500'];
const purple500 = purple['500'];

export default class RecyclePage extends PureComponent {
  static propTypes = {
    selectImages: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isEditing: false,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isEditing: !!nextProps.counter });
  }

  _handleQuitEditing = () => {
    this.props.disableSelectAll();
  }

  _handleOpenModal = (type) => {
    const { selectImages } = this.props;
    if (selectImages.length === 0) {
      this.props.snackBarOpen('您尚未选择相片');
      return;
    }

    const isRecovery = type === 'recovery';
    this.props.modalOpen({
      title: '提示',
      content: isRecovery ? '是否确认恢复所选照片' : '是否确认彻底删除所选照片？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={isRecovery ? this._handleRecoveryImgs : this._handleDeleteImgs}
        />
      ),
    });
  }

  _handleRecoveryImgs = () => {
    const { selectImages } = this.props;
    this.props.modalClose();
    this.renderLoadModal('恢复相片中');
    const selectImagesIds = selectImages.map((image) => image._id);
    recoveryImages.callPromise({ selectImages: selectImagesIds })
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen('恢复相片成功');
        this.props.disableSelectAll();
      })
      .catch((err) => {
        this.props.modalClose();
        this.props.snackBarOpen(`恢复相片失败 ${err.reason}`);
      });
  }

  _handleDeleteImgs = () => {
    const { selectImages } = this.props;
    this.props.modalClose();
    this.renderLoadModal('删除相片中');
    const selectImagesIds = selectImages.map((image) => image._id);
    const keys = selectImages.map((image) => {
      const key = `${image.user}/${image.collection}/${image.name}.${image.type}`;
      return key;
    });
    Meteor.callPromise('Qiniu.remove', { keys })
      .then(() => removeImages.callPromise({ selectImages: selectImagesIds }))
      .then(() => {
        this.props.modalClose();
        this.props.snackBarOpen('删除相片成功');
        this.props.disableSelectAll();
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
      });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { counter } = this.props;
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            style={{ backgroundColor: this.state.isEditing ? blue500 : purple500 }}
            title={counter ? `选择了${counter}张照片` : '回收站'}
            Left={this.state.isEditing && (
              <IconButton
                color="contrast"
                onClick={this._handleQuitEditing}
              ><CloseIcon />
              </IconButton>
            )}
            Right={[
              <IconButton
                key="btn__Recovery"
                color="contrast"
                onClick={() => this._handleOpenModal('recovery')}
              ><RecoveryIcon />
              </IconButton>,
              <IconButton
                key="btn__delete"
                color="contrast"
                onClick={() => this._handleOpenModal('delete')}
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
