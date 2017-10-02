import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Radio, { RadioGroup } from 'material-ui/Radio';
import AddPhotoIcon from 'material-ui-icons/AddToPhotos';
import EditIcon from 'material-ui-icons/Edit';
import CloseIcon from 'material-ui-icons/Close';
import ShiftIcon from 'material-ui-icons/KeyboardReturn';
import RemoveIcon from 'material-ui-icons/Delete';
import SetCoverIcon from 'material-ui-icons/Wallpaper';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods.js';
import { mutateCollectionCover } from '/imports/api/collections/methods.js';
import settings from '/imports/utils/settings';
import RootLayout from '/imports/ui/layouts/RootLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import ConnectedJustified from '/imports/ui/components/JustifiedLayout';
import { CircleLoader } from '/imports/ui/components/Loader';
import PhotoSwipeHolder from './components/PhotoSwipeHolder';

const { domain } = settings;

export default class CollectionPage extends Component {
  static propTypes = {
    initialAlertState: PropTypes.object.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    isGuest: PropTypes.bool.isRequired,
    curColl: PropTypes.object.isRequired,
    otherColls: PropTypes.array.isRequired,
    images: PropTypes.array.isRequired,
    User: PropTypes.object,
    counter: PropTypes.number.isRequired,
    selectImages: PropTypes.array.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    uploaderStart: PropTypes.func.isRequired,
  }

  static defaultProps = {
    initialAlertState: { isAlertOpen: false, alertTitle: '', alertContent: '', action: '' },
  }

  state = {
    isProcessing: false,
    processMsg: '',
    isEditing: false,
    isAlertOpen: false,
    alertTitle: '',
    alertContent: '',
    action: '',
  }

  _handleQuitEditing = () => {
    this.props.disableSelectAll();
    this.setState({ isEditing: false });
  }

  _handleOpenUploader = () => {
    const { curColl } = this.props;
    document.getElementById('Uploader').click();
    this.props.uploaderStart({ destination: curColl.name });
  }

  _handleShiftPhoto = () => {
    const { curColl, selectImages } = this.props;
    const destColl = JSON.parse(this.state.destColl);

    const keys = _.map(selectImages, (image) => {
      const srcKey = `${image.user}/${curColl.name}/${image.name}.${image.type}`;
      const destKey = `${image.user}/${destColl.name}/${image.name}.${image.type}`;
      return {
        src: srcKey,
        dest: destKey,
      };
    });

    Meteor.callPromise('Qiniu.move', { keys })
    .then((res) => {
      const rets = res.results;
      // Only shift images which are moved success in Qiniu
      let moveStatus = [];
      let sucMsg;
      let sucMovedImgIds = _.map(selectImages, (image) => image._id);

      for (let i = 0; i < rets.length; i++) {
        const status = rets[i].code;
        const data = rets[i].data;
        if (status !== 200) {
          moveStatus = [...moveStatus, i];
          console.warn(status, data);
        }
      }
      if (moveStatus.length > 0) {
        sucMsg = '部分照片转移失败';
        sucMovedImgIds = _.filter(sucMovedImgIds, (v, i) => _.indexOf(moveStatus, i) < 0);
      }
      return { sucMsg, sucMovedImgIds };
    })
    .then((related) => { // eslint-disable-line
      return shiftImages.callPromise({
        selectImages: related.sucMovedImgIds,
        dest: destColl.name,
        destPrivateStat: destColl.private,
      })
      .then(() => related.sucMsg || '转移照片成功');
    })
    .then((sucMsg) => {
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(sucMsg);
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(`转移照片失败 ${err.reason}`);
    });
  }

  _handleSetCover = () => {
    const { selectImages, curColl } = this.props;
    const curImg = selectImages[0];
    const cover = `${domain}/${curImg.user}/${curImg.collection}/${curImg.name}.${curImg.type}`;
    mutateCollectionCover.callPromise({
      collId: curColl._id,
      cover,
    })
    .then(() => {
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('更换封面成功');
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(`更换封面失败 ${err.reason}`);
    });
  }

  _handleRemovePhoto = () => {
    const { selectImages } = this.props;
    const selectImagesIds = _.map(selectImages, (image) => image._id);
    removeImagesToRecycle.callPromise({ selectImages: selectImagesIds })
    .then(() => {
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('删除相片成功');
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
    });
  }

  handleOnTimeout() {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('请求超时，请重试');
  }

  /**
   * setState based on action
   * @param {String} action - One of ShiftPhoto / SetCover / RemovePhoto
   */
  openAlert(action) {
    const { otherColls, selectImages } = this.props;
    let alertTitle;
    let alertContent;
    if (selectImages.length === 0) {
      this.props.snackBarOpen('您还未选择照片');
      return;
    }
    if (action === 'ShiftPhoto') {
      const radios = [];
      for (let i = 0; i < otherColls.length; i++) {
        const collName = otherColls[i].name;
        const collStat = otherColls[i].private;
        radios.push(
          <Radio
            key={i}
            value={JSON.stringify({ name: collName, private: collStat })}
            label={collName}
            style={{ marginTop: '16px' }}
          />
        );
      }
      alertTitle = '移动至以下相册';
      alertContent = (
        <RadioGroup
          name="collection"
          defaultSelected={this.state.destColl}
          onChange={(e) => this.setState({ destColl: e.target.value })}
        >{radios}
        </RadioGroup>
      );
    }
    if (action === 'SetCover') {
      if (selectImages.length > 1) {
        this.props.snackBarOpen('只能选择一张照片作为封面');
        return;
      }
      alertContent = '是否确认将其设置为封面';
    }
    if (action === 'RemovePhoto') {
      alertContent = '是否确认删除所选照片？';
    }
    this.setState({ isAlertOpen: true, alertTitle, alertContent, action });
  }

  triggerDialogAction(action) {
    const newState = Object.assign({}, this.props.initialAlertState, { isProcessing: true, processMsg: '处理中' });
    this.setState(newState);
    this[`handle${action}`]();
  }

  renderEditingNavHeader() {
    const { counter } = this.props;
    return (
      <SecondaryNavHeader
        title={counter ? `选择了${counter}张照片` : ''}
        Left={<IconButton color="contrast" onClick={this._handleQuitEditing}><CloseIcon /></IconButton>}
        Right={
          <div>
            <IconButton
              color="contrast"
              onClick={() => this.openAlert('ShiftPhoto')}
            ><ShiftIcon />
            </IconButton>
            <IconButton
              color="contrast"
              onClick={() => this.openAlert('SetCover')}
            ><SetCoverIcon />
            </IconButton>
            <IconButton
              color="contrast"
              onClick={() => this.openAlert('RemovePhoto')}
            ><RemoveIcon />
            </IconButton>
          </div>
        }
      />
    );
  }

  renderNavHeader() {
    const { isGuest, curColl } = this.props;
    return (
      <SecondaryNavHeader
        title={curColl.name}
        Right={
          !isGuest && (
            <div>
              <IconButton
                color="contrast"
                onClick={this._handleOpenUploader}
              ><AddPhotoIcon />
              </IconButton>
              <IconButton
                color="contrast"
                onClick={() => this.setState({ isEditing: true })}
              ><EditIcon />
              </IconButton>
            </div>
          )
        }
      />
    );
  }

  renderContent() {
    const { images, curColl } = this.props;

    let duration;
    const imgLen = images.length;
    if (imgLen === 0) {
      duration = '暂无相片';
    } else if (imgLen === 1) {
      duration = moment(images[0].shootAt).format('YYYY年MM月DD日');
    } else if (imgLen > 1) {
      const start = moment(images[imgLen - 1].shootAt).format('YYYY年MM月DD日');
      const end = moment(images[0].shootAt).format('YYYY年MM月DD日');
      duration = `${start} - ${end}`;
    }
    return (
      <div className="content__collPics">
        <header className="collPics__header">
          <h2 className="collPics__name">{curColl.name}</h2>
          <div className="collPics__duration">{duration}</div>
        </header>
        {
          imgLen > 0 && (
            <ConnectedJustified
              isEditing={this.state.isEditing}
              images={images}
            />
          )
        }
      </div>
    );
  }

  render() {
    const { dataIsReady, initialAlertState } = this.props;
    return (
      <RootLayout
        loading={!dataIsReady}
        Topbar={this.state.isEditing ? this.renderEditingNavHeader() : this.renderNavHeader()}
      >
        <CircleLoader
          open={this.state.isProcessing}
          message={this.state.processMsg}
          onTimeout={this.handleOnTimeout}
        />
        { dataIsReady && this.renderContent() }
        <PhotoSwipeHolder />
        <Dialog
          title={this.state.alertTitle}
          titleStyle={{ border: 'none' }}
          actions={[
            <Button
              label="取消"
              onClick={() => this.setState(initialAlertState)}
              primary
            />,
            <Button
              label="确认"
              onClick={() => this.triggerDialogAction(this.state.action)}
              primary
            />,
          ]}
          actionsContainerStyle={{ border: 'none' }}
          open={this.state.isAlertOpen}
          onRequestClose={() => this.setState(initialAlertState)}
          autoScrollBodyContent
        >
          {this.state.alertContent}
        </Dialog>
      </RootLayout>
    );
  }

}
