import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link, browserHistory } from 'react-router';
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
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-to-photos';
import ShareIcon from 'material-ui/svg-icons/social/share';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ShiftIcon from 'material-ui/svg-icons/hardware/keyboard-return';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SetCoverIcon from 'material-ui/svg-icons/device/wallpaper';
import { blue500 } from 'material-ui/styles/colors';

import { Images } from '/imports/api/images/image.js';
import { Collections } from '/imports/api/collections/collection.js';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods.js';
import { removeCollection, mutateCollectionCover } from '/imports/api/collections/methods.js';

import NavHeader from '../components/NavHeader.jsx';
import Justified from '../components/Justified/Justified.jsx';
import { uploaderStart, disableSelectAll, snackBarOpen } from '../actions/actionTypes.js';

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
};

class ColPics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEditing: false,
      isAlertOpen: false,
      alertTitle: '',
      alertContent: '',
      action: '',
    };
    this.handleOpenUploader = this.handleOpenUploader.bind(this);
    this.handleSaveEditing = this.handleSaveEditing.bind(this);
    this.handleShiftPhoto = this.handleShiftPhoto.bind(this);
    this.handleRemovePhoto = this.handleRemovePhoto.bind(this);
    this.handleSetCover = this.handleSetCover.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
  }

  componentWillMount() {
    const { User, colName } = this.props;
    fetch('/api/uptoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: User.username,
        collection: colName,
      }),
    })
    .then((res) => res.json())
    .then((data) => this.setState({ data }))
    .catch((ex) => {
      throw new Meteor.Error(ex);
    });
  }

  handleOpenUploader() {
    const { dispatch } = this.props;
    const { data } = this.state;
    document.getElementById('uploader').click();
    dispatch(uploaderStart(data));
  }

  handleSaveEditing(e) {
    const { dispatch } = this.props;
    e.preventDefault();
    dispatch(disableSelectAll());
    this.setState({ isEditing: false });
  }

  /**
   * setState base on action
   * @param {String} action - One of / ShiftPhoto / RemovePhoto / SetCover / RemoveCollection
   */
  openAlert(action) {
    const { colNames, selectImages, dispatch } = this.props;
    let alertTitle;
    let alertContent;
    if (action === 'RemoveCollection') {
      alertTitle = '警告！';
      alertContent = '相册删除后将不可恢复！是否确认删除该相册？';
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
      for (let i = 0; i < colNames.length; i++) {
        const id = colNames[i]._id;
        const colName = colNames[i].name;
        radios.push(
          <RadioButton
            key={id}
            value={colName}
            label={colName}
            style={styles.radioButton}
          />
        );
      }
      alertTitle = '移动至以下相册';
      alertContent = (
        <RadioButtonGroup
          name="collection"
          defaultSelected={this.state.shiftTo}
          onChange={(e) => { this.setState({ shiftTo: e.target.value }); }}
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
    this.setState(initialAlertState);
    this[`handle${action}`]();
  }

  handleShiftPhoto() {
    const { selectImages, colName, dispatch } = this.props;
    const { shiftTo } = this.state;
    shiftImages.call({
      selectImages,
      source: colName,
      destination: shiftTo,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen('转移照片失败'));
        throw new Meteor.Error(err);
      }
      dispatch(disableSelectAll());
      dispatch(snackBarOpen('转移照片成功'));
    });
  }

  handleRemovePhoto() {
    const { User, selectImages, colName, dispatch } = this.props;
    removeImagesToRecycle.call({
      selectImages,
      uid: User._id,
      colName,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen('删除失败'));
        throw new Meteor.Error(err);
      }
      dispatch(disableSelectAll());
      dispatch(snackBarOpen('删除成功'));
    });
  }

  handleSetCover() {
    const { User, images, selectImages, colName, dispatch } = this.props;
    const cover = _.find(images, (image) => image._id === selectImages[0]).url;
    mutateCollectionCover.call({
      cover,
      uid: User._id,
      colName,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen('更换封面失败'));
        throw new Meteor.Error(err);
      }
      dispatch(disableSelectAll());
      dispatch(snackBarOpen('更换封面成功'));
    });
  }

  handleRemoveCollection() {
    const { User, colName, dispatch } = this.props;
    removeCollection.call({
      uid: User._id,
      colName,
    }, (err) => {
      if (err) {
        dispatch(snackBarOpen('删除相册失败'));
        throw new Meteor.Error(err);
      }
      browserHistory.replace('/collection');
      dispatch(snackBarOpen('删除相册成功'));
    });
  }

  renderIconRight() {
    return (
      <div>
        <IconButton iconStyle={styles.AppBarIconSvg} onTouchTap={this.handleOpenUploader}>
          <AddPhotoIcon />
        </IconButton>
        <IconButton iconStyle={styles.AppBarIconSvg} onTouchTap={this.handleSharePhoto}>
          <ShareIcon />
        </IconButton>
        <IconMenu
          iconButtonElement={
            <IconButton iconStyle={styles.AppBarIconSvg}><MoreVertIcon /></IconButton>
          }
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          <MenuItem primaryText="下载所有图片" />
          <MenuItem
            primaryText="编辑相册"
            onTouchTap={() => { this.setState({ isEditing: true }); }}
          />
          <MenuItem
            primaryText="删除相册"
            onTouchTap={() => { this.openAlert('RemoveCollection'); }}
          />
        </IconMenu>
      </div>
    );
  }

  renderNavHeader() {
    return (
      <NavHeader
        User={this.props.User}
        title="相册"
        iconElementLeft={
          <IconButton containerElement={<Link to="/collection" />}>
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
        iconElementLeft={<IconButton onTouchTap={this.handleSaveEditing}><DoneIcon /></IconButton>}
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
    const { colName, images } = this.props;
    let duration;
    if (images.length === 0) {
      duration = '暂无相片';
      return (
        <div className="col-pics-holder">
          <div className="col-pics-header">
            <div className="col-pics-name">{colName}</div>
            <div className="col-pics-duration">{duration}</div>
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
      <div className="col-pics-holder">
        <div className="col-pics-header">
          <div className="col-pics-name">{colName}</div>
          <div className="col-pics-duration">{duration}</div>
        </div>
        <Justified isEditing={this.state.isEditing} images={images} />
      </div>
    );
  }

  render() {
    const { dataIsReady } = this.props;
    const actions = [
      <FlatButton
        label="取消"
        onTouchTap={() => { this.setState(initialAlertState); }}
        primary
      />,
      <FlatButton
        label="确认"
        onTouchTap={() => { this.triggerDialogAction(this.state.action); }}
        primary
      />,
    ];
    return (
      <div className="container">
        { this.state.isEditing
          ? this.renderEditingNavHeader()
          : this.renderNavHeader() }
        <div className="content">
          { dataIsReady
            ? this.renderColPics()
            : this.renderLoader() }
          <Dialog
            title={this.state.alertTitle}
            actions={actions}
            open={this.state.isAlertOpen}
            onRequestClose={() => { this.setState(initialAlertState); }}
            autoScrollBodyContent
          >
            {this.state.alertContent}
          </Dialog>
        </div>
      </div>
    );
  }

}

ColPics.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  colName: PropTypes.string.isRequired,
  colNames: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  // Below Pass From Redux
  selectImages: PropTypes.array,
  counter: PropTypes.number,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(({ params }) => {
  const { colName } = params;
  const imageHandle = Meteor.subscribe('Images.inCollection', colName);
  const colHandle = Meteor.subscribe('Collections.colNames');
  const dataIsReady = imageHandle.ready() && colHandle.ready();
  const images = Images.find({}, {
    sort: { shootAt: -1 },
  }).fetch();
  const colNames = Collections.find({ name: { $ne: colName } }).fetch();
  return {
    colName,
    colNames,
    images,
    dataIsReady,
  };
}, ColPics);

const mapStateToProps = (state) => ({
  selectImages: state.selectCounter.selectImages,
  counter: state.selectCounter.counter,
});

export default connect(mapStateToProps)(MeteorContainer);
