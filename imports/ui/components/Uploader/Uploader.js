import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import uuid from 'node-uuid';
import { insertImage } from '/imports/api/images/methods.js';
import settings from '/imports/utils/settings';
import Portal from '../Portal';
import {
  Wrapper,
  Inner,
  ThumbnailSection,
  DetailSection,
  Message,
  DestMessage,
  StopButton,
  Progress,
} from './Uploader.style.js';

const { imageDomain } = settings;

const initialState = {
  pace: 0,               // Current File Uploading Progress
  current: 0,           // Current Uploading file
  total: 1,            // total Uploading files length
  thumbnail: '',      // Current Uploading thumbnail
  uploading: false,  // Is in Uploading Progress
};

// TODO 令该组件可最小化后台运行
export default class Uploader extends Component {
  static propTypes = {
    multiple: PropTypes.bool.isRequired,
    onBeforeUpload: PropTypes.func,
    onAfterUpload: PropTypes.func,
    User: PropTypes.object.isRequired,
    token: PropTypes.string,
    open: PropTypes.bool.isRequired,
    destination: PropTypes.string,  // not required bc don't need it before Uploading
    storeUptoken: PropTypes.func.isRequired,
    clearUptoken: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    uploaderStop: PropTypes.func.isRequired,
  }

  static defaultProps = {
    open: false,
    multiple: false,
  }

  constructor(props) {
    super(props);
    this._cancelFn = undefined;
    this._allowedFiles = ['image/jpeg', 'image/png', 'image/gif'];
    this._uploadURL = window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com';
  }

  state = initialState

  componentDidMount() {
    Meteor.callPromise('Qiniu.getUptoken')
    .then((res) => {
      console.log('%c Meteor finish getUptoken', 'color: blue');
      this.props.storeUptoken(res.uptoken);
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(`获取七牛云token失败 ${err}`);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.open !== nextProps.open ||
    JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  componentWillUnmount() {
    this.props.clearUptoken();
  }

  /**
   * Call when user select images to upload
   * @param {object}  e - input change event
   *
   * Get the uploading files' length,
   * Show uploading box,
   *
   * After Done above, call beforeUpload.
   */
  _handleImageChange = (e) => {
    if (!this.props.token) {
      this.props.snackBarOpen('上传失败 - [uptoken is not exist]');
      return;
    }
    const files = [...e.target.files];
    this.setState({
      total: files.length,
      uploading: true,
    }, () => {
      if (this.props.onBeforeUpload) {
        this.props.onBeforeUpload(files);
      }
      this.beforeUpload(files);
    });
  }

  /**
   * Call after uploading box show, before uploading to Qiniu
   * @param {array}  files - all files wait for uploading
   * @param {object}  file - current wait uploading file(image), not exist when first call
   *
   * Check whether currentFile is valid image,
   * Show currentFile(image)'s thumbnail,
   * Extract currentFile(image)'s information, eg: type, dimension...,
   *
   * After done above, call uploadingToQiniu.
   */
  beforeUpload(files, file) {
    if (!files) {
      throw new Error('File is empty, check whether miss select upload files');
    }

    const { User, destination, token } = this.props;

    const currentFile = file || files[0];

    // If upload not allowedFiles, We need stop upload.
    if (this._allowedFiles.indexOf(currentFile.type) < 0) {
      this.props.uploaderStop();
      this.props.snackBarOpen('只允许上传.jpg .png或.gif文件');
      return;
    } else if (this._allowedFiles.indexOf(currentFile.type) === 0) currentFile.surfix = 'jpg';
    else if (this._allowedFiles.indexOf(currentFile.type) === 1) currentFile.surfix = 'png';
    else if (this._allowedFiles.indexOf(currentFile.type) === 2) currentFile.surfix = 'gif';

    this.setState({
      current: this.state.current + 1,
      thumbnail: URL.createObjectURL(currentFile),
    }, () => {
      const fileName = uuid.v4();
      const formData = new FormData();

      formData.append('file', currentFile);
      formData.append('key', `${User.username}/${destination}/${fileName}.${currentFile.surfix}`);
      formData.append('token', token);
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const dimension = [width, height];

        // We need to store image's fileName dimension and lastModified in local DB
        currentFile.fileName = fileName;
        currentFile.dimension = dimension;
        currentFile.shootAt = currentFile.lastModified;
        this.uploadingToQiniu(formData, files, currentFile);
      };
      img.src = this.state.thumbnail;
    });
  }

  /**
   * Call after Extract image's information, before insert image to database
   * @param {object} formData - contain required key/value pairs for uploading to qiniu
   * @param {array}  files    - all files
   * @param {object} file     - current file which has injected information
   *
   * Use Ajax to upload file to Qiniu,
   *
   * After done above, call afterUploadFile.
   */
  uploadingToQiniu(formData, files, file) {
    if (!file || !files || !formData) {
      throw new Error('Required arguments not exist, please check it');
    }

    const currentFile = file;

    axios({
      method: 'POST',
      url: this._uploadURL,
      data: formData,
      cancelToken: new axios.CancelToken((c) => {
        // An executor function receives a cancel function as a parameter
        this._cancelFn = c;
      }),
      onUploadProgress: (evt) => this.uploadingFile(evt),
    })
    .then(() => {
      this.afterUploadFile(files, currentFile);
    })
    .catch((err) => {
      this.finishUpload(err);
    });
  }

  /**
   * Call when uploading image to Qiniu
   * @param {object}  e   - click event object
   * @param {object}  xhr - xhr object
   *
   * Bind click event listender to StopButton,
   * Show uploading progress.
   */
  uploadingFile(e) {
    if (this.stopButton) {
      this.stopButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.stopUploading();
      }, false);
    }
    if (e.lengthComputable) {
      const percentComplete = e.loaded / e.total;
      const pace = `${Math.round(percentComplete * 100)}%`;
      this.setState({ pace });
      console.log(pace);
    }
  }

  /**
   * Call after finish uploading file to Qiniu
   * @param {array}  files    - all files
   * @param {object} file     - current file which has uploaded
   *
   * Via Qiniu ?imageAve api grab its average color and attach it to uploaded file,
   * Insert uploaded file to databse.
   *
   * After done above,
   *   if has uploaded all files, call finishUpload without error param,
   *   if has files wait for upload, call beforeUpload with files and next file params.
   *   if got error, call finishUpload with error param.
   *
   */
  afterUploadFile(files, file) {
    const { User, destination } = this.props;
    const image = {
      user: User.username,
      collection: destination,
      name: file.fileName,
      type: file.surfix,
      dimension: file.dimension,
      shootAt: file.shootAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const imageURL = encodeURI(`${imageDomain}/${image.user}/${image.collection}/${image.name}.${image.type}`);

    const getImageAve = () => axios.get(`${imageURL}?imageAve`);
    const getImageExif = () => axios.get(`${imageURL}?exif`);

    if (image.type === 'jpg') {
      axios.all([getImageAve(), getImageExif()])
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
      .then(() => {
        if (this.state.current === this.state.total) {
          this.finishUpload(null);
        } else {
          // if have not upload all files, we need to call it again
          this.beforeUpload(files, files[this.state.current]);
        }
      })
      .catch((err) => {
        this.finishUpload(err);
      });
    } else {
      getImageAve()
      .then((res) => {
        image.color = `#${res.data.RGB.split('0x')[1]}`;
        return insertImage.callPromise(image);
      })
      .then(() => {
        if (this.state.current === this.state.total) {
          this.finishUpload(null);
        } else {
          // if have not upload all files, we need to call it again
          this.beforeUpload(files, files[this.state.current]);
        }
      })
      .catch((err) => {
        this.finishUpload(err);
      });
    }
  }

  /**
   * Call when click stopButton when uploading
   * @param {object}  e   - click event object
   * @param {object}  xhr - xhr object
   *
   * Abort xhr request
   * Reset initialState,
   * HideUploader and show message via snackBar.
   */
  stopUploading() {
    if (
      this._cancelFn !== undefined &&
      typeof this._cancelFn === 'function'
    ) {
      this._cancelFn();
      this.setState(initialState);
      this.props.uploaderStop();
      this.props.snackBarOpen(`您取消了上传文件, 已成功上传${this.state.current}个文件`);
    }
  }

  /**
   * Call error happen when uploading to qiniu or use qiniu API or manipulate database
   * Or call after all files have uploaded
   * @param {object}  err - null or error object
   *
   * Reset initialState,
   * HideUploader and show message via snackBar.
   */
  finishUpload(err) {
    let message;
    if (err) {
      if (this._cancelFn) {
        message = '您取消了上传';
      } else {
        message = '上传失败';
      }
      console.log(err);
    } else {
      message = `成功上传${this.state.total}个文件`;
    }
    this.setState(initialState);
    this.props.uploaderStop();
    this.props.snackBarOpen(message);
    this._cancelFn = undefined;
    if (this.props.onAfterUpload) {
      this.props.onAfterUpload(err);
    }
  }

  render() {
    const { open, multiple, destination } = this.props;
    if (open && this.state.uploading) {
      return (
        <Portal name="Uploader">
          <Wrapper>
            <Inner>
              <ThumbnailSection style={{ backgroundImage: `url(${this.state.thumbnail})` }} />
              <DetailSection>
                <Message>正在上传至</Message>
                <DestMessage>{destination}</DestMessage>
                <Message>第{this.state.current}张, 共{this.state.total}张</Message>
                <StopButton innerRef={(ref) => { this.stopButton = ref; }}>停止</StopButton>
                <Progress style={{ width: this.state.pace }} />
              </DetailSection>
            </Inner>
          </Wrapper>
        </Portal>
      );
    }
    return (
      <div>
        <input
          id="Uploader"
          type="file"
          style={{ display: 'none' }}
          onChange={this._handleImageChange}
          ref={(ref) => { this.filesInput = ref; }}
          multiple={multiple}
          accept="image/*"
        />
      </div>
    );
  }
}
