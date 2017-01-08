import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { createContainer } from 'meteor/react-meteor-data';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import CircularProgress from 'material-ui/CircularProgress';
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
import { Collections } from '/imports/api/collections/collection.js';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods.js';
import {
  removeCollection,
  lockCollection,
  mutateCollectionCover } from '/imports/api/collections/methods.js';
import scrollTo from '/imports/utils/scrollTo.js';
import ConnectedNavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import ConnectedJustified from '/imports/ui/components/Justified/Justified.jsx';
import { uploaderStart, disableSelectAll, snackBarOpen } from '/imports/ui/redux/actions/creators.js';

const domain = Meteor.settings.public.domain;
const initialAlertState = { isAlertOpen: false, alertTitle: '', alertContent: '', action: '' };

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

class CollPicsPage extends Component {
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
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch(disableSelectAll());
    this.setState({ isEditing: false });
  }

  handleOpenUploader() {
    const { uptoken, User, curColl, dispatch } = this.props;
    const data = {
      uptoken,
      key: `${User.username}/${curColl.name}/`,
    };
    document.getElementById('uploader').click();
    dispatch(uploaderStart(data));
  }

  handleLockCollection(cb) {
    const { curColl } = this.props;
    const msg = curColl.private ? '公开' : '加密';
    lockCollection.call({
      colId: curColl._id,
      colName: curColl.name,
      privateStatus: curColl.private,
    }, (err) => {
      if (err) {
        cb(err, `${msg}相册失败`);
      }
      cb(null, `${msg}相册成功`);
    });
  }

  handleRemoveCollection(cb) {
    const { User, images, curColl, dispatch } = this.props;

    if (images.length === 0) {
      return removeCollection.call({ colName: curColl.name }, (err) => {
        if (err) {
          cb(err, '删除相册失败');
        }
        browserHistory.replace(`/user/${User.username}/collection`);
        dispatch(snackBarOpen('删除相册成功'));
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
      return removeCollection.call({ colName: curColl.name }, (err) => {
        if (err) {
          cb(err, '删除相册失败');
        }
        browserHistory.replace(`/user/${User.username}/collection`);
        dispatch(snackBarOpen('删除相册成功'));
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
        dest: destColl.id,
      }, (err) => {
        if (err) {
          cb(err, '转移照片失败');
        }
        cb(null, sucMsg, true);
      });
    });
  }

  handleSetCover(cb) {
    const { selectImages, curColl } = this.props;
    const curImg = selectImages[0];
    const cover = `${domain}/${curImg.user}/${curImg.collection}/${curImg.name}.${curImg.type}`;
    mutateCollectionCover.call({
      cover,
      colName: curColl.name,
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
    const { curColl, otherColls, selectImages, dispatch } = this.props;
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
      dispatch(snackBarOpen('您没有选择照片'));
      return;
    }
    if (action === 'SetCover' && selectImages.length > 1) {
      dispatch(snackBarOpen('只能选择一张照片作为封面'));
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
    const { dispatch } = this.props;
    const curState = Object.assign({}, initialAlertState, { isProcessing: true });

    this.setState(curState);

    const actionCallback = (err, msg, isEditing) => {
      dispatch(snackBarOpen(msg));
      if (err) {
        throw new Meteor.Error(err);
      }
      if (isEditing) dispatch(disableSelectAll());
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
    const { User, isGuest } = this.props;
    if (!isGuest) {
      return (
        <ConnectedNavHeader
          User={User}
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
    return (
      <ConnectedNavHeader
        User={User}
        title="相册"
        iconElementLeft={
          <IconButton onTouchTap={() => browserHistory.goBack()}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
    );
  }

  renderEditingNavHeader() {
    const { User, counter } = this.props;
    return (
      <ConnectedNavHeader
        User={User}
        title={counter ? `选择了${counter}张照片` : ''}
        style={{ backgroundColor: blue500 }}
        iconElementLeft={<IconButton onTouchTap={this.handleQuitEditing}><CloseIcon /></IconButton>}
        iconElementRight={
          <div>
            <IconButton
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => { this.openAlert('ShiftPhoto'); }}
            >
              <ShiftIcon />
            </IconButton>
            <IconButton
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => { this.openAlert('SetCover'); }}
            >
              <SetCoverIcon />
            </IconButton>
            <IconButton
              iconStyle={styles.AppBarIconSvg}
              onTouchTap={() => { this.openAlert('RemovePhoto'); }}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        }
      />
    );
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} />
      </div>
    );
  }

  renderColPics() {
    const { curColl, images } = this.props;
    let duration;
    if (images.length === 0) {
      duration = '暂无相片';
      return (
        <div className="collPics">
          <div className="collPics__header">
            <div className="collPics__name">{curColl.name}</div>
            <div className="collPics__duration">{duration}</div>
          </div>
        </div>
      );
    }
    if (images.length === 1) {
      duration = moment(images[0].shootAt).format('YYYY年MM月DD日');
    }
    if (images.length > 1) {
      const start = moment(images[images.length - 1].shootAt).format('YYYY年MM月DD日');
      const end = moment(images[0].shootAt).format('YYYY年MM月DD日');
      duration = `${start} - ${end}`;
    }
    return (
      <div className="collPics">
        <div className="collPics__header">
          <div className="collPics__name">{curColl.name}</div>
          <div className="collPics__duration">{duration}</div>
        </div>
        <ConnectedJustified isEditing={this.state.isEditing} images={images} />
      </div>
    );
  }

  render() {
    const { dataIsReady } = this.props;
    const actions = [
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
    ];
    return (
      <div className="container">
        { this.state.isEditing
          ? this.renderEditingNavHeader()
          : this.renderNavHeader() }
        <div className="content">
          { this.state.isProcessing && <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" /> }
          { dataIsReady
            ? this.renderColPics()
            : this.renderLoader() }
          <Dialog
            title={this.state.alertTitle}
            titleStyle={{ border: 'none' }}
            actions={actions}
            actionsContainerStyle={{ border: 'none' }}
            open={this.state.isAlertOpen}
            onRequestClose={() => this.setState(initialAlertState)}
            autoScrollBodyContent
          >
            {this.state.alertContent}
          </Dialog>
        </div>
      </div>
    );
  }

}

CollPicsPage.propTypes = {
  User: PropTypes.object,
  // Below is Pass from database
  dataIsReady: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  curColl: PropTypes.object.isRequired,
  otherColls: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass From Redux
  uptoken: PropTypes.string,
  selectImages: PropTypes.array,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(({ params }) => {
  const { username, cname } = params;
  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true
  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const collHandler = Meteor.subscribe('Collections.inUser', username);
  const imageHandler = Meteor.subscribe('Images.inCollection', { username, cname });
  const dataIsReady = collHandler.ready() && imageHandler.ready();

  // curColl is currentCollection use for lock/remove etc.
  const curColl = Collections.findOne({ name: cname }) || {};
  const collExists = dataIsReady && !!curColl;
  // otherColls use for shift photos
  const otherColls = Collections.find(
    { name: { $ne: cname } },
    { fields: { name: 1 } }
  ).fetch();
  return {
    dataIsReady,
    isGuest,
    curColl,
    otherColls,
    images: collExists ? curColl.images().fetch() : [],
  };
}, CollPicsPage);

const mapStateToProps = (state) => ({
  uptoken: state.uptoken,
  selectImages: state.selectCounter.selectImages,
  counter: state.selectCounter.counter,
});

export default connect(mapStateToProps)(MeteorContainer);
