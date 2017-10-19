import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import Radio, { RadioGroup } from 'material-ui/Radio';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import AddPhotoIcon from 'material-ui-icons/AddToPhotos';
import EditIcon from 'material-ui-icons/Edit';
import CloseIcon from 'material-ui-icons/Close';
import ShiftIcon from 'material-ui-icons/KeyboardReturn';
import RemoveIcon from 'material-ui-icons/Delete';
import SetCoverIcon from 'material-ui-icons/Wallpaper';
import settings from '/imports/utils/settings';
import { removeImagesToRecycle, shiftImages } from '/imports/api/images/methods';
import { mutateCollectionCover } from '/imports/api/collections/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import ModalActions from '/imports/ui/components/Modal/Common/ModalActions';
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';
import withLoadable from '/imports/ui/hocs/withLoadable';

const { imageDomain } = settings;

const modalState = {
  destName: null,
};

const AsyncContent = withLoadable({
  loader: () => import('./components/Content'),
});

export default class CollectionPage extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    curColl: PropTypes.object.isRequired,
    otherColls: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    selectImages: PropTypes.array.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    uploaderStart: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    isEditing: false,
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
    const { curColl, selectImages, otherColls } = this.props;

    this.props.modalClose();
    this.renderLoadModal('转移照片中');

    const keys = _.map(selectImages, (image) => {
      const srcKey = `${image.user}/${curColl.name}/${image.name}.${image.type}`;
      const destKey = `${image.user}/${modalState.destName}/${image.name}.${image.type}`;
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

        for (let i = 0; i < rets.length; i += 1) {
          const status = rets[i].code;
          const { data } = rets[i];
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
      .then((related) => {
        const destColl = _.find(otherColls, (coll) => coll.name === modalState.destName);
        return shiftImages.callPromise({
          selectImages: related.sucMovedImgIds,
          dest: destColl.name,
          destPrivateStat: destColl.private,
        }).then(() => related.sucMsg || '转移照片成功');
      })
      .then((sucMsg) => {
        this.props.disableSelectAll();
        this.props.modalClose();
        this.props.snackBarOpen(sucMsg);
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`转移照片失败 ${err.reason}`);
      });
  }

  _handleSetCover = () => {
    const { selectImages, curColl } = this.props;
    const curImg = selectImages[0];
    const cover = `${imageDomain}/${curImg.user}/${curImg.collection}/${curImg.name}.${curImg.type}`;

    this.props.modalClose();
    this.renderLoadModal('设置封面中');

    mutateCollectionCover.callPromise({
      collId: curColl._id,
      cover,
    })
      .then(() => {
        this.props.disableSelectAll();
        this.props.modalClose();
        this.props.snackBarOpen('更换封面成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`更换封面失败 ${err.reason}`);
      });
  }

  _handleRemovePhoto = () => {
    const { selectImages } = this.props;

    this.props.modalClose();
    this.renderLoadModal('删除照片中');

    removeImagesToRecycle.callPromise({ selectImages: _.map(selectImages, (image) => image._id) })
      .then(() => {
        this.props.disableSelectAll();
        this.props.modalClose();
        this.props.snackBarOpen('删除相片成功');
      })
      .catch((err) => {
        console.log(err);
        this.props.modalClose();
        this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
      });
  }

  renderShiftModal = () => {
    const { selectImages, otherColls } = this.props;
    if (selectImages.length < 1) {
      this.props.snackBarOpen('请选择要转移的照片');
      return;
    }
    const radios = _.map(otherColls, (coll, i) => (
      <FormControlLabel
        key={i}
        value={coll.name}
        label={coll.name}
        control={<Radio />}
      />
    ));

    const showModal = () => {
      const defaultValue = _.get(otherColls, '[0].name');
      modalState.destName = defaultValue;
      this.props.modalOpen({
        title: '移动至以下相册',
        content: (
          <RadioGroup
            name="collection"
            value={modalState.destName || defaultValue}
            onChange={(e, value) => {
              modalState.destName = value;
              showModal();
            }}
          >{radios}
          </RadioGroup>
        ),
        actions: (
          <ModalActions
            sClick={() => {
              this.props.modalClose();
              modalState.destName = null;
            }}
            pClick={() => {
              this._handleShiftPhoto();
              modalState.destName = null;
            }}
          />
        ),
      });
    };
    showModal();
  }

  renderSetCoverModal = () => {
    const { selectImages } = this.props;
    if (selectImages.length !== 1) {
      this.props.snackBarOpen('请选择一张照片');
      return;
    }
    this.props.modalOpen({
      title: '提示',
      content: '是否确认将其设置为封面',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={this._handleSetCover}
        />
      ),
    });
  }

  renderRemoveModal = () => {
    const { selectImages } = this.props;
    if (selectImages.length < 1) {
      this.props.snackBarOpen('请选择要删除的照片');
      return;
    }
    this.props.modalOpen({
      title: '提示',
      content: '是否确认删除所选照片？',
      actions: (
        <ModalActions
          sClick={this.props.modalClose}
          pClick={this._handleRemovePhoto}
        />
      ),
    });
  }

  renderLoadModal = (message, errMsg = '请求超时') => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
  }

  render() {
    const { dataIsReady, isOwner, curColl, match, counter } = this.props;
    const curCollName = match.params.collName;
    return (
      <ViewLayout
        Topbar={
          this.state.isEditing
          ? (
            <SecondaryNavHeader
              title={counter ? `选择了${counter}张照片` : ''}
              Left={<IconButton color="contrast" onClick={this._handleQuitEditing}><CloseIcon /></IconButton>}
              Right={[
                <IconButton
                  key="btn__shift"
                  color="contrast"
                  onClick={this.renderShiftModal}
                ><ShiftIcon />
                </IconButton>,
                <IconButton
                  key="btn__setCover"
                  color="contrast"
                  onClick={this.renderSetCoverModal}
                ><SetCoverIcon />
                </IconButton>,
                <IconButton
                  key="btn__remove"
                  color="contrast"
                  onClick={this.renderRemoveModal}
                ><RemoveIcon />
                </IconButton>,
              ]}
            />
          )
          : (
            <SecondaryNavHeader
              title={curCollName}
              Right={
                isOwner && [
                  <IconButton
                    key="btn__upload"
                    color="contrast"
                    onClick={this._handleOpenUploader}
                  ><AddPhotoIcon />
                  </IconButton>,
                  <IconButton
                    key="btn__edit"
                    color="contrast"
                    onClick={() => this.setState({ isEditing: true })}
                  ><EditIcon />
                  </IconButton>,
                ]}
            />
          )
        }
      >
        <AsyncContent
          dataIsReady={dataIsReady}
          curColl={curColl}
          isEditing={this.state.isEditing}
        />
      </ViewLayout>
    );
  }
}
