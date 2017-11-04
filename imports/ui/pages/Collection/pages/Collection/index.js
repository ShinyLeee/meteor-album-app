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
import Modal from '/imports/ui/components/Modal';
import ModalActions from '/imports/ui/components/Modal/Common/ModalActions';
import withLoadable from '/imports/ui/hocs/withLoadable';

const { imageDomain } = settings;

const modalState = {
  destName: null,
};

const AsyncContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class CollectionPage extends Component {
  static propTypes = {
    isOwner: PropTypes.bool.isRequired,
    curColl: PropTypes.object.isRequired,
    otherColls: PropTypes.array.isRequired,
    counter: PropTypes.number.isRequired,
    selectImages: PropTypes.array.isRequired,
    disableSelectAll: PropTypes.func.isRequired,
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
    this.props.uploaderStart(curColl.name);
  }

  _handleShiftPhoto = async () => {
    try {
      const { curColl, selectImages, otherColls } = this.props;
      await Modal.showLoader('转移照片中');
      const keys = _.map(selectImages, (image) => ({
        src: `${image.user}/${curColl.name}/${image.name}.${image.type}`,
        dest: `${image.user}/${modalState.destName}/${image.name}.${image.type}`,
      }));
      const { results } = await Meteor.callPromise('Qiniu.move', { keys });
      // Only shift images which are moved success in Qiniu
      let moveStatus = [];
      let moveMessage = '转移照片成功';
      let movedImages = _.map(selectImages, (image) => image._id);

      for (let i = 0; i < results.length; i += 1) {
        const status = results[i].code;
        const { data } = results[i];
        if (status !== 200) {
          moveStatus = [...moveStatus, i];
          console.warn(status, data);
        }
      }
      if (moveStatus.length > 0) {
        moveMessage = '部分照片转移失败';
        movedImages = _.filter(movedImages, (v, i) => _.indexOf(moveStatus, i) < 0);
      }
      const destColl = _.find(otherColls, (coll) => coll.name === modalState.destName);
      await shiftImages.callPromise({
        selectImages: movedImages,
        dest: destColl.name,
        destPrivateStat: destColl.private,
      });
      Modal.close();
      this.props.disableSelectAll();
      this.props.snackBarOpen(moveMessage);
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`转移照片失败 ${err.reason}`);
    }
  }

  _handleSetCover = async () => {
    try {
      const { selectImages, curColl } = this.props;
      const curImg = selectImages[0];
      const cover = `${imageDomain}/${curImg.user}/${curImg.collection}/${curImg.name}.${curImg.type}`;
      await Modal.showLoader('设置封面中');
      await mutateCollectionCover.callPromise({
        collId: curColl._id,
        cover,
      });
      Modal.close();
      this.props.disableSelectAll();
      this.props.snackBarOpen('更换封面成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`更换封面失败 ${err.reason}`);
    }
  }

  _handleRemovePhoto = async () => {
    try {
      const selectImages = _.map(this.props.selectImages, (image) => image._id);
      Modal.close();
      await Modal.showLoader('删除照片中');
      await removeImagesToRecycle.callPromise({ selectImages });
      Modal.close();
      this.props.disableSelectAll();
      this.props.snackBarOpen('删除相片成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`删除相片失败 ${err.reason}`);
    }
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
      const value = modalState.destName || defaultValue;
      modalState.destName = value;
      Modal.show({
        title: '移动至以下相册',
        content: (
          <RadioGroup
            name="collection"
            value={value}
            onChange={(e, val) => {
              modalState.destName = val;
              showModal();
            }}
          >{radios}
          </RadioGroup>
        ),
        actions: (
          <ModalActions
            onCancel={() => {
              Modal.close();
              modalState.destName = null;
            }}
            onConfirm={async () => {
              await this._handleShiftPhoto();
              modalState.destName = null;
            }}
          />
        ),
      });
    };
    showModal();
  }

  renderSetCoverPrompt = () => {
    const { selectImages } = this.props;
    if (selectImages.length !== 1) {
      this.props.snackBarOpen('请选择一张照片');
      return;
    }
    Modal.showPrompt({
      message: '是否确认将其设置为封面',
      onCancel: Modal.close,
      onConfirm: this._handleSetCover,
    });
  }

  renderRemovePrompt = () => {
    const { selectImages } = this.props;
    if (selectImages.length < 1) {
      this.props.snackBarOpen('请选择要删除的照片');
      return;
    }
    Modal.showPrompt({
      message: '是否确认删除所选照片？',
      onCancel: Modal.close,
      onConfirm: this._handleRemovePhoto,
    });
  }

  render() {
    const { isOwner, match, counter } = this.props;
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
                  onClick={this.renderSetCoverPrompt}
                ><SetCoverIcon />
                </IconButton>,
                <IconButton
                  key="btn__remove"
                  color="contrast"
                  onClick={this.renderRemovePrompt}
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
        <AsyncContent isEditing={this.state.isEditing} />
      </ViewLayout>
    );
  }
}
