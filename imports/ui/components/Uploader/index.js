import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { insertImage } from '/imports/api/images/methods';
import settings from '/imports/utils/settings';
import Portal from '/imports/ui/components/Portal';
import { snackBarOpen, uploaderStop } from '/imports/ui/redux/actions';
import Uploader from './Uploader';

const { imageDomain } = settings;

class UploaderContainer extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    dest: PropTypes.string.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    uploaderStop: PropTypes.func.isRequired,
  }

  // eslint-disable-next-line class-methods-use-this
  generateKey(key) {
    const v1 = key.split('/');
    const v2 = v1[2].split('.');
    return {
      user: v1[0],
      collection: v1[1],
      name: v2[0],
      type: v2[1],
    };
  }

  _handleAfterUpload = async (state, currentFile) => {
    const { user, collection, name, type } = this.generateKey(state.key);
    const image = {
      user,
      collection,
      name,
      type,
      dimension: currentFile.dimension,
      shootAt: currentFile.lastModified,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const imageURL = encodeURI(`${imageDomain}/${state.key}`);

    const getImageAve = () => axios.get(`${imageURL}?imageAve`);
    const getImageExif = () => axios.get(`${imageURL}?exif`);

    if (image.type === 'jpg') {
      return axios.all([getImageAve(), getImageExif()])
        .then(axios.spread((aveRes, exifRes) => {
          image.color = `#${aveRes.data.RGB.split('0x')[1]}`;
          const exif = exifRes.data;
          const orientation = exif.Orientation;
          const exifDate = exif.DateTimeOriginal || exif.DateTimeDigitized || exif.DateTime;
          if (orientation) {
            if (orientation.val === 'Right-top' || orientation.val === 'Left-bottom') {
              image.dimension = image.dimension.reverse();
            }
          }
          if (exifDate) {
            const temp = exifDate.val.split(' ');
            temp[0] = temp[0].split(':').join('-');
            image.shootAt = new Date(`${temp[0]}T${temp[1]}`);
          }
          return insertImage.callPromise(image);
        }))
        .catch((err) => {
          // fallback if can not get image average color
          console.warn(err);
          image.color = '#eee';
          return insertImage.callPromise(image);
        });
    }
    return getImageAve()
      .then((res) => {
        image.color = `#${res.data.RGB.split('0x')[1]}`;
        return insertImage.callPromise(image);
      })
      .catch((err) => {
        console.warn(err);
        image.color = '#eee';
        return insertImage.callPromise(image);
      });
  }

  _handleCancelUpload = (state) => {
    this.props.uploaderStop();
    this.props.snackBarOpen(`您取消了上传文件, 已成功上传${state.current - 1}个文件`);
  }

  _handleFinishUpload = (err, state) => {
    const message = (err && err.toString()) || `成功上传${state.current}个文件`;
    this.props.snackBarOpen(message);
    this.props.uploaderStop();
  }

  render() {
    const { User, dest } = this.props;
    const prefix = `${User.username}/${dest}`;
    return (
      <Portal name="Uploader">
        <Uploader
          title={dest}
          prefix={prefix}
          afterUpload={this._handleAfterUpload}
          onCancel={this._handleCancelUpload}
          onFinish={this._handleFinishUpload}
          multiple
        />
      </Portal>
    );
  }
}

const mapStateToProps = ({ sessions, portals }) => ({
  User: sessions.User,
  dest: portals.uploader.dest,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  uploaderStop,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UploaderContainer);
