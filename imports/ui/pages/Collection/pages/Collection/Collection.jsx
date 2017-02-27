import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import moment from 'moment';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-to-photos';
import LockInIcon from 'material-ui/svg-icons/action/lock-outline';
import LockOutIcon from 'material-ui/svg-icons/action/lock-open';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import ShiftIcon from 'material-ui/svg-icons/hardware/keyboard-return';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SetCoverIcon from 'material-ui/svg-icons/device/wallpaper';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods.js';
import {
  removeCollection,
  lockCollection,
  mutateCollectionCover,
} from '/imports/api/collections/methods.js';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import ConnectedJustified from '/imports/ui/components/JustifiedLayout/Justified.jsx';
import Loader from '/imports/ui/components/Loader/Loader.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import PhotoSwipeHolder from './components/PhotoSwipeHolder/PhotoSwipeHolder.jsx';

export default class CollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      processMsg: '',
      isEditing: false,
      isAlertOpen: false,
      alertTitle: '',
      alertContent: '',
      action: '',
    };
    this.handleQuitEditing = this.handleQuitEditing.bind(this);
    this.handleOpenUploader = this.handleOpenUploader.bind(this);
    this.handleLockCollection = this.handleLockCollection.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
    this.handleShiftPhoto = this.handleShiftPhoto.bind(this);
    this.handleSetCover = this.handleSetCover.bind(this);
    this.handleRemovePhoto = this.handleRemovePhoto.bind(this);
    this.handleOnTimeout = this.handleOnTimeout.bind(this);
  }

  actionCallback(err, msg, isEditing) {
    if (isEditing) this.props.disableSelectAll();
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen(msg);
    if (err) {
      console.log(err); // eslint-disable-line no-console
      throw new Meteor.Error(err);
    }
  }

  handleQuitEditing(e) {
    e.preventDefault();
    this.props.disableSelectAll();
    this.setState({ isEditing: false });
  }

  handleOpenUploader() {
    const { uptoken, User, curColl } = this.props;
    const data = {
      uptoken,
      key: `${User.username}/${curColl.name}/`,
    };
    document.getElementById('Uploader__container').click();
    this.props.uploaderStart(data);
  }

  handleLockCollection() {
    const { User, curColl } = this.props;
    const msg = curColl.private ? '公开' : '加密';
    lockCollection.callPromise({
      username: User.username,
      collId: curColl._id,
      collName: curColl.name,
      privateStat: curColl.private,
    })
    .then(() => {
      this.actionCallback(null, `${msg}相册成功`);
    })
    .catch((err) => {
      this.actionCallback(err, `${msg}相册失败`);
    });
  }

  handleRemoveCollection() {
    const { User, images, curColl } = this.props;
    if (images.length === 0) {
      return removeCollection.callPromise({ collId: curColl._id })
      .then(() => {
        browserHistory.replace(`/user/${User.username}/collection`);
        this.props.snackBarOpen('删除相册成功');
      })
      .catch((err) => {
        this.actionCallback(err, '删除相册失败');
      });
    }

    const keys = _.map(images, (image) => {
      let key = false;
      if (image.collection === curColl.name) {
        key = `${image.user}/${curColl.name}/${image.name}.${image.type}`;
      }
      return key;
    });

    return Meteor.callPromise('Qiniu.remove', { keys })
    .then(() => removeCollection.callPromise({ collId: curColl._id }))
    .then(() => {
      browserHistory.replace(`/user/${User.username}/collection`);
      this.props.snackBarOpen('删除相册成功');
    })
    .catch((err) => {
      this.actionCallback(err, '删除相册失败');
    });
  }

  handleShiftPhoto() {
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
          console.warn(status, data); // eslint-disable-line no-console
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
      this.actionCallback(null, sucMsg, true);
    })
    .catch((err) => {
      this.actionCallback(err, '转移照片失败');
    });
  }

  handleSetCover() {
    const { domain, selectImages, curColl } = this.props;
    const curImg = selectImages[0];
    const cover = `${domain}/${curImg.user}/${curImg.collection}/${curImg.name}.${curImg.type}`;
    mutateCollectionCover.callPromise({
      collId: curColl._id,
      cover,
    })
    .then(() => {
      this.actionCallback(null, '更换封面成功', true);
    })
    .catch((err) => {
      this.actionCallback(err, '更换封面失败');
    });
  }

  handleRemovePhoto() {
    const { selectImages } = this.props;
    const selectImagesIds = _.map(selectImages, (image) => image._id);
    removeImagesToRecycle.callPromise({ selectImages: selectImagesIds })
    .then(() => {
      this.actionCallback(null, '删除成功', true);
    })
    .catch((err) => {
      this.actionCallback(err, '删除失败');
    });
  }

  handleOnTimeout() {
    this.setState({ isProcessing: false, processMsg: '' });
    this.props.snackBarOpen('上传超时，请重试');
  }

  /**
   * setState based on action
   * @param {String} action - One of / ShiftPhoto / RemovePhoto / SetCover / RemoveCollection
   */
  openAlert(action) {
    const { curColl, otherColls, selectImages } = this.props;
    let alertTitle;
    let alertContent;
    if (action === 'LockCollection') {
      alertTitle = '提示';
      if (curColl.private) alertContent = '公开后所有人可查看该相册中的照片, 是否确认公开此相册？';
      else alertContent = '加密后该相册中的照片将对他人不可见，是否确认加密此相册？';
      this.setState({ isAlertOpen: true, alertTitle, alertContent, action });
      return;
    }
    if (action === 'RemoveCollection') {
      alertTitle = '警告！';
      alertContent = '删除相册后将不可恢复！是否确认删除该相册？';
      this.setState({ isAlertOpen: true, alertTitle, alertContent, action });
      return;
    }
    if (!selectImages || selectImages.length === 0) {
      this.props.snackBarOpen('您没有选择照片');
      return;
    }
    if (action === 'SetCover' && selectImages.length > 1) {
      this.props.snackBarOpen('只能选择一张照片作为封面');
      return;
    }
    if (action === 'ShiftPhoto') {
      const radios = [];
      for (let i = 0; i < otherColls.length; i++) {
        const collName = otherColls[i].name;
        const collStat = otherColls[i].private;
        radios.push(
          <RadioButton
            key={i}
            value={JSON.stringify({ name: collName, private: collStat })}
            label={collName}
            style={{ marginTop: '16px' }}
          />
        );
      }
      alertTitle = '移动至以下相册';
      alertContent = (
        <RadioButtonGroup
          name="collection"
          defaultSelected={this.state.destColl}
          onChange={(e) => this.setState({ destColl: e.target.value })}
        >{radios}
        </RadioButtonGroup>
      );
    }
    if (action === 'RemovePhoto') alertContent = '是否确认删除所选照片？';
    if (action === 'SetCover') alertContent = '是否确认将其设置为封面';
    this.setState({ isAlertOpen: true, alertTitle, alertContent, action });
  }

  triggerDialogAction(action) {
    const newState = Object.assign({}, this.props.initialAlertState, { isProcessing: true, processMsg: '处理中' });
    this.setState(newState);
    this[`handle${action}`]();
  }

  renderNavHeader() {
    const { isGuest, curColl } = this.props;
    return isGuest
    ? (<SecondaryNavHeader title={curColl.name} />)
    : (
      <SecondaryNavHeader
        title={curColl.name}
        iconElementRight={
          <div>
            <IconButton iconStyle={{ color: '#fff' }} onTouchTap={this.handleOpenUploader}>
              <AddPhotoIcon />
            </IconButton>
            <IconButton iconStyle={{ color: '#fff' }} onTouchTap={() => this.openAlert('LockCollection')}>
              { curColl && curColl.private ? (<LockOutIcon />) : (<LockInIcon />) }
            </IconButton>
            <IconMenu
              iconButtonElement={<IconButton iconStyle={{ color: '#fff' }}><MoreVertIcon /></IconButton>}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <MenuItem
                primaryText="编辑相册"
                onTouchTap={() => this.setState({ isEditing: true })}
              />
              <MenuItem
                primaryText="删除相册"
                onTouchTap={() => this.openAlert('RemoveCollection')}
              />
            </IconMenu>
          </div>
        }
      />);
  }

  renderContent() {
    const { images, curColl } = this.props;

    let duration;
    const imgLen = images.length;
    if (imgLen === 0) duration = '暂无相片';
    else if (imgLen === 1) duration = moment(images[0].shootAt).format('YYYY年MM月DD日');
    else if (imgLen > 1) {
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
        { imgLen > 0 && (
          <ConnectedJustified
            isEditing={this.state.isEditing}
            images={images}
          />
        ) }
      </div>
    );
  }

  render() {
    const {
      User,
      counter,
      dataIsReady,
      initialAlertState,
    } = this.props;
    return (
      <div className="container">
        { this.state.isEditing
          ? (
            <SecondaryNavHeader
              User={User}
              title={counter ? `选择了${counter}张照片` : ''}
              iconElementLeft={<IconButton onTouchTap={this.handleQuitEditing}><CloseIcon /></IconButton>}
              iconElementRight={
                <div>
                  <IconButton
                    iconStyle={{ color: '#fff' }}
                    onTouchTap={() => this.openAlert('ShiftPhoto')}
                  ><ShiftIcon />
                  </IconButton>
                  <IconButton
                    iconStyle={{ color: '#fff' }}
                    onTouchTap={() => this.openAlert('SetCover')}
                  ><SetCoverIcon />
                  </IconButton>
                  <IconButton
                    iconStyle={{ color: '#fff' }}
                    onTouchTap={() => this.openAlert('RemovePhoto')}
                  ><RemoveIcon />
                  </IconButton>
                </div>
              }
            />
          )
          : this.renderNavHeader()
        }
        <main className="content">
          <Loader
            open={this.state.isProcessing}
            message={this.state.processMsg}
            onTimeout={this.handleOnTimeout}
          />
          {
            dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
          <PhotoSwipeHolder />
          <Dialog
            title={this.state.alertTitle}
            titleStyle={{ border: 'none' }}
            actions={[
              <FlatButton
                label="取消"
                onTouchTap={() => this.setState(initialAlertState)}
                primary
              />,
              <FlatButton
                label="确认"
                onTouchTap={() => this.triggerDialogAction(this.state.action)}
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
        </main>
      </div>
    );
  }

}

CollectionPage.displayName = 'CollectionPage';

CollectionPage.defaultProps = {
  domain: Meteor.settings.public.imageDomain,
  initialAlertState: { isAlertOpen: false, alertTitle: '', alertContent: '', action: '' },
};

CollectionPage.propTypes = {
  User: PropTypes.object,
  domain: PropTypes.string.isRequired,
  initialAlertState: PropTypes.object.isRequired,
  // Below Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curColl: PropTypes.object.isRequired,
  otherColls: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass From Redux
  uptoken: PropTypes.string, // not required bc guest can vist this page but without uptoken
  counter: PropTypes.number.isRequired,
  selectImages: PropTypes.array.isRequired,
  disableSelectAll: PropTypes.func.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
  uploaderStart: PropTypes.func.isRequired,
};
