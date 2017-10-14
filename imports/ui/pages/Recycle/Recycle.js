import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import RecoveryIcon from 'material-ui-icons/Replay';
import RemoveIcon from 'material-ui-icons/Delete';
import blue from 'material-ui/colors/blue';
import purple from 'material-ui/colors/purple';
import { removeImages, recoveryImages } from '/imports/api/images/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import { ModalActions } from '/imports/ui/components/Modal';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import Loader from '/imports/ui/components/Loader';
import JustifiedSelectIcon from '/imports/ui/components/JustifiedLayout/components/snippet/JustifiedSelectIcon';
import ConnectedGridLayout from '/imports/ui/components/JustifiedLayout/components/GridLayout';

const blue500 = blue['500'];
const purple500 = purple['500'];

export default class RecyclePage extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    selectImages: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
    enableSelectAll: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isAllSelect: false,
    isProcessing: false,
    processMsg: '',
    isEditing: false,
  }

  componentWillReceiveProps(nextProps) {
    const { images } = this.props;
    const { counter } = nextProps;
    if (counter > 0) {
      this.setState({ isEditing: true });
      if (images.length === counter) this.setState({ isAllSelect: true });
      else this.setState({ isAllSelect: false });
    } else {
      this.setState({ isEditing: false, isAllSelect: false });
    }
  }

  _handleQuitEditing = () => {
    this.props.disableSelectAll();
  }

  _handleToggleSelectAll = () => {
    const { images } = this.props;
    if (this.state.isAllSelect) {
      this.props.disableSelectAll();
    } else {
      const counter = images.length;
      this.props.enableSelectAll({
        selectImages: images,
        group: { recycle: counter },
        counter,
      });
    }
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
    this.setState({ isProcessing: true, processMsg: '恢复相片中' });
    const selectImagesIds = selectImages.map((image) => image._id);
    recoveryImages.callPromise({ selectImages: selectImagesIds })
      .then(() => {
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen('恢复相片成功');
        this.props.disableSelectAll();
      })
      .catch((err) => {
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen(`恢复相片失败 ${err.reason}`);
      });
  }

  _handleDeleteImgs = () => {
    const { selectImages } = this.props;
    this.props.modalClose();
    this.setState({ isProcessing: true, processMsg: '删除相片中' });
    const selectImagesIds = selectImages.map((image) => image._id);
    const keys = selectImages.map((image) => {
      const key = `${image.user}/${image.collection}/${image.name}.${image.type}`;
      return key;
    });
    Meteor.callPromise('Qiniu.remove', { keys })
      .then(() => removeImages.callPromise({ selectImages: selectImagesIds }))
      .then(() => {
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen('删除相片成功');
        this.props.disableSelectAll();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isProcessing: false, processMsg: '' });
        this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
      });
  }

  renderContent() {
    const { images } = this.props;
    if (images.length === 0) {
      return <EmptyHolder mainInfo="您的回收站是空的" />;
    }
    return (
      <div className="content__recycle">
        <header className="recycle__header">
          <h2 className="recycle__title">回收站</h2>
          <div className="recycle__desc">回收站中的内容会在 30 天后永久删除</div>
        </header>
        <div className="recycle__content">
          <div className="recycle__toolbox">
            <div
              className="recycle__toolbox_left"
              role="button"
              tabIndex={-1}
              onClick={this._handleToggleSelectAll}
            >
              <JustifiedSelectIcon activate={this.state.isAllSelect} />
              <h4>选择全部</h4>
            </div>
          </div>
          <ConnectedGridLayout
            isEditing={this.state.isEditing}
            images={images}
          />
        </div>
      </div>
    );
  }

  render() {
    const { dataIsReady, counter } = this.props;
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
        <Loader
          open={this.state.isProcessing}
          message={this.state.processMsg}
        />
        { dataIsReady && this.renderContent() }
      </ViewLayout>
    );
  }
}
