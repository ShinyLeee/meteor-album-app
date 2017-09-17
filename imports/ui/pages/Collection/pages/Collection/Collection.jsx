import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-to-photos';
import EditIcon from 'material-ui/svg-icons/image/edit';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import ShiftIcon from 'material-ui/svg-icons/hardware/keyboard-return';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SetCoverIcon from 'material-ui/svg-icons/device/wallpaper';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods.js';
import { mutateCollectionCover } from '/imports/api/collections/methods.js';
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
    this.handleShiftPhoto = this.handleShiftPhoto.bind(this);
    this.handleSetCover = this.handleSetCover.bind(this);
    this.handleRemovePhoto = this.handleRemovePhoto.bind(this);
    this.handleOnTimeout = this.handleOnTimeout.bind(this);
  }

  handleQuitEditing(e) {
    e.preventDefault();
    this.props.disableSelectAll();
    this.setState({ isEditing: false });
  }

  handleOpenUploader() {
    const { curColl } = this.props;
    document.getElementById('Uploader').click();
    this.props.uploaderStart({ destination: curColl.name });
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
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen(sucMsg);
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '转移照片失败');
      throw new Meteor.Error(err);
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
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('更换封面成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '更换封面失败');
      throw new Meteor.Error(err);
    });
  }

  handleRemovePhoto() {
    const { selectImages } = this.props;
    const selectImagesIds = _.map(selectImages, (image) => image._id);
    removeImagesToRecycle.callPromise({ selectImages: selectImagesIds })
    .then(() => {
      this.props.disableSelectAll();
      this.setState({ isProcessing: false, processMsg: '' });
      this.props.snackBarOpen('删除相片成功');
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      this.props.snackBarOpen(err.reason || '删除相片失败');
      throw new Meteor.Error(err);
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
      counter,
      dataIsReady,
      initialAlertState,
      isGuest,
      curColl,
    } = this.props;
    return (
      <div className="container">
        { this.state.isEditing
          ? (
            <SecondaryNavHeader
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
          : (
            <SecondaryNavHeader
              title={curColl.name}
              iconElementRight={
                isGuest
                ? <div />
                : (
                  <div>
                    <IconButton
                      iconStyle={{ color: '#fff' }}
                      onTouchTap={this.handleOpenUploader}
                    ><AddPhotoIcon />
                    </IconButton>
                    <IconButton
                      iconStyle={{ color: '#fff' }}
                      onTouchTap={() => this.setState({ isEditing: true })}
                    ><EditIcon />
                    </IconButton>
                  </div>
                )
              }
            />
          )
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
  counter: PropTypes.number.isRequired,
  selectImages: PropTypes.array.isRequired,
  disableSelectAll: PropTypes.func.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
  uploaderStart: PropTypes.func.isRequired,
};
