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
import LinearProgress from 'material-ui/LinearProgress';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-to-photos';
import LockInIcon from 'material-ui/svg-icons/action/lock-outline';
import LockOutIcon from 'material-ui/svg-icons/action/lock-open';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import ShiftIcon from 'material-ui/svg-icons/hardware/keyboard-return';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SetCoverIcon from 'material-ui/svg-icons/device/wallpaper';
import { blue500 } from 'material-ui/styles/colors';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods.js';
import {
  removeCollection,
  lockCollection,
  mutateCollectionCover,
} from '/imports/api/collections/methods.js';
import scrollTo from '/imports/utils/scrollTo.js';

import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import Justified from '/imports/ui/components/Justified/Justified.jsx';

const styles = {
  AppBarIconSvg: {
    width: '26px',
    height: '26px',
    color: '#fff',
  },
  floatBtn: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
  },
  radioButton: {
    marginTop: '16px',
  },
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

export default class CollectionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEditing: false,
      isProcessing: false,
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
  }

  handleQuitEditing(e) {
    e.preventDefault();
    this.props.disableSelectAll();
    this.setState({ isEditing: false });
  }

  handleOpenUploader() {
    const data = {
      uptoken: this.props.uptoken,
      key: `${this.props.User.username}/${this.props.curColl.name}/`,
    };
    document.getElementById('Uploader__container').click();
    this.props.uploaderStart(data);
  }

  handleLockCollection(cb) {
    const { User, curColl } = this.props;
    const msg = curColl.private ? '公开' : '加密';
    lockCollection.call({
      username: User.username,
      collId: curColl._id,
      collName: curColl.name,
      privateStatus: curColl.private,
    }, (err) => {
      if (err) {
        cb(err, `${msg}相册失败`);
      }
      cb(null, `${msg}相册成功`);
    });
  }

  handleRemoveCollection(cb) {
    const { User, images, curColl } = this.props;
    if (images.length === 0) {
      return removeCollection.call({
        username: User.username,
        collId: curColl._id,
        collName: curColl.name,
      }, (err) => {
        if (err) {
          cb(err, '删除相册失败');
        }
        browserHistory.replace(`/user/${User.username}/collection`);
        this.props.snackBarOpen('删除相册成功');
      });
    }

    const keys = _.map(images, (image) => {
      let key = false;
      if (image.collection === curColl.name) {
        key = `${image.user}/${curColl.name}/${image.name}.${image.type}`;
      }
      return key;
    });

    return Meteor.call('Qiniu.remove', { keys }, (error) => {
      if (error) {
        cb(error, '删除相册失败');
      }
      return removeCollection.call({
        username: User.username,
        collId: curColl._id,
        colName: curColl.name,
      }, (err) => {
        if (err) {
          cb(err, '删除相册失败');
        }
        browserHistory.replace(`/user/${User.username}/collection`);
        this.props.snackBarOpen('删除相册成功');
      });
    });
  }

  handleShiftPhoto(cb) {
    const { selectImages, curColl } = this.props;
    const destColl = JSON.parse(this.state.destColl);

    const keys = _.map(selectImages, (image) => {
      const srcKey = `${image.user}/${curColl.name}/${image.name}.${image.type}`;
      const destKey = `${image.user}/${destColl.name}/${image.name}.${image.type}`;
      return {
        src: srcKey,
        dest: destKey,
      };
    });

    Meteor.call('Qiniu.move', { keys }, (error, res) => {
      if (error) {
        cb(error, '转移照片失败');
      }
      const rets = res.results;

      // Only shift images which are moved success in Qiniu
      let moveStatus = [];
      let sucMsg = '转移照片成功';
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

      shiftImages.call({
        selectImages: sucMovedImgIds,
        dest: destColl.name,
      }, (err) => {
        if (err) {
          cb(err, '转移照片失败');
        }
        cb(null, sucMsg, true);
      });
    });
  }

  handleSetCover(cb) {
    const { domain, selectImages, curColl } = this.props;
    const curImg = selectImages[0];
    const cover = `${domain}/${curImg.user}/${curImg.collection}/${curImg.name}.${curImg.type}`;
    mutateCollectionCover.call({
      collId: curColl._id,
      cover,
    }, (err) => {
      if (err) {
        cb(err, '更换封面失败');
      }
      cb(null, '更换封面成功', true);
    });
  }

  handleRemovePhoto(cb) {
    const { selectImages } = this.props;
    const selectImagesIds = _.map(selectImages, (image) => image._id);
    removeImagesToRecycle.call({ selectImages: selectImagesIds }, (err) => {
      if (err) {
        cb(err, '删除失败');
      }
      cb(err, '删除成功', true);
    });
  }

  /**
   * setState base on action
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
        const collId = otherColls[i]._id;
        const collName = otherColls[i].name;
        radios.push(
          <RadioButton
            key={i}
            value={JSON.stringify({ id: collId, name: collName })}
            label={collName}
            style={styles.radioButton}
          />
        );
      }
      alertTitle = '移动至以下相册';
      alertContent = (
        <RadioButtonGroup
          name="collection"
          defaultSelected={this.state.destColl}
          onChange={(e) => this.setState({ destColl: e.target.value })}
        >
          {radios}
        </RadioButtonGroup>
      );
    }
    if (action === 'RemovePhoto') alertContent = '是否确认删除所选照片？';
    if (action === 'SetCover') alertContent = '是否确认将其设置为封面';
    this.setState({ isAlertOpen: true, alertTitle, alertContent, action });
  }

  triggerDialogAction(action) {
    const curState = Object.assign({}, this.props.initialAlertState, { isProcessing: true });

    this.setState(curState);

    const actionCallback = (err, msg, isEditing) => {
      this.props.snackBarOpen(msg);
      if (err) {
        throw new Meteor.Error(err);
      }
      if (isEditing) this.props.disableSelectAll();
      this.setState({ isProcessing: false });
    };

    this[`handle${action}`](actionCallback);
  }

  renderIconRight() {
    const { curColl } = this.props;
    return (
      <div>
        <IconButton iconStyle={styles.AppBarIconSvg} onTouchTap={this.handleOpenUploader}>
          <AddPhotoIcon />
        </IconButton>
        <IconButton
          iconStyle={styles.AppBarIconSvg}
          onTouchTap={() => this.openAlert('LockCollection')}
        >
          { curColl && curColl.private ? (<LockOutIcon />) : (<LockInIcon />) }
        </IconButton>
        <IconMenu
          iconButtonElement={
            <IconButton iconStyle={styles.AppBarIconSvg}><MoreVertIcon /></IconButton>
          }
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
    );
  }

  renderNavHeader() {
    return this.props.isGuest
    ? (
      <NavHeader
        User={this.props.User}
        title="相册"
        iconElementLeft={
          <IconButton onTouchTap={() => browserHistory.goBack()}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
    )
    : (
      <NavHeader
        User={this.props.User}
        title="相册"
        onTitleTouchTap={() => scrollTo(0, 1500)}
        iconElementLeft={
          <IconButton onTouchTap={() => browserHistory.goBack()}>
            <ArrowBackIcon />
          </IconButton>
        }
        iconElementRight={this.renderIconRight()}
      />
    );
  }

  renderEditingNavHeader() {
    const { User, counter } = this.props;
    return (
      <NavHeader
        User={User}
        title={counter ? `选择了${counter}张照片` : ''}
        style={{ backgroundColor: blue500 }}
        iconElementLeft={<IconButton onTouchTap={this.handleQuitEditing}><CloseIcon /></IconButton>}
        iconElementRight={
          <div>
            <IconButton
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => { this.openAlert('ShiftPhoto'); }}
            ><ShiftIcon />
            </IconButton>
            <IconButton
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => { this.openAlert('SetCover'); }}
            ><SetCoverIcon />
            </IconButton>
            <IconButton
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => { this.openAlert('RemovePhoto'); }}
            ><RemoveIcon />
            </IconButton>
          </div>
        }
      />
    );
  }

  renderCollPics() {
    let duration;
    const imgLen = this.props.images.length;
    if (imgLen === 0) duration = '暂无相片';
    else if (imgLen === 1) duration = moment(this.props.images[0].shootAt).format('YYYY年MM月DD日');
    else if (imgLen > 1) {
      const start = moment(this.props.images[imgLen - 1].shootAt).format('YYYY年MM月DD日');
      const end = moment(this.props.images[0].shootAt).format('YYYY年MM月DD日');
      duration = `${start} - ${end}`;
    }
    return (
      <div className="content__collPics">
        <div className="collPics__header">
          <div className="collPics__name">{this.props.curColl.name}</div>
          <div className="collPics__duration">{duration}</div>
        </div>
        { imgLen > 0 && (
          <Justified
            domain={this.props.domain}
            isEditing={this.state.isEditing}
            images={this.props.images}
            group={this.props.group}
            counter={this.props.counter}
            selectCounter={this.props.selectCounter}
            selectGroupCounter={this.props.selectGroupCounter}
            enableSelectAll={this.props.enableSelectAll}
            disableSelectAll={this.props.disableSelectAll}
          />
        ) }
      </div>
    );
  }

  render() {
    const actions = [
      <FlatButton
        label="取消"
        onTouchTap={() => this.setState(this.props.initialAlertState)}
        primary
      />,
      <FlatButton
        label="确认"
        onTouchTap={() => this.triggerDialogAction(this.state.action)}
        primary
      />,
    ];
    return (
      <div className="container">
        { this.state.isEditing
          ? this.renderEditingNavHeader()
          : this.renderNavHeader() }
        <div className="content">
          { this.state.isProcessing
              && <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" /> }
          { this.props.dataIsReady
            ? this.renderCollPics()
            : (<LinearProgress style={styles.indeterminateProgress} mode="indeterminate" />) }
          <Dialog
            title={this.state.alertTitle}
            titleStyle={{ border: 'none' }}
            actions={actions}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.isAlertOpen}
            onRequestClose={() => this.setState(this.props.initialAlertState)}
            autoScrollBodyContent
          >
            {this.state.alertContent}
          </Dialog>
        </div>
      </div>
    );
  }

}

CollectionPage.displayName = 'CollectionPage';

CollectionPage.defaultProps = {
  domain: Meteor.settings.public.domain,
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
  selectImages: PropTypes.array.isRequired,
  group: PropTypes.object.isRequired,
  counter: PropTypes.number.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
  uploaderStart: PropTypes.func.isRequired,
  selectCounter: PropTypes.func.isRequired,
  selectGroupCounter: PropTypes.func.isRequired,
  enableSelectAll: PropTypes.func.isRequired,
  disableSelectAll: PropTypes.func.isRequired,
};
