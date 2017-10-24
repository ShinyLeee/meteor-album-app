import axios from 'axios';
import uuid from 'node-uuid';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MIMEToExtension } from '/imports/utils';
import UploaderShower from './UploaderShower';

const uploadURL = window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com';

// TODO 令该组件可最小化后台运行
class Uploader extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
    prefix: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    beforeUpload: PropTypes.func,
    afterUpload: PropTypes.func,
    onCancel: PropTypes.func,
    onFinish: PropTypes.func,
  }

  static defaultProps = {
    accept: 'image/gif, image/jpeg, image/png',
    multiple: false,
  }

  constructor(props) {
    super(props);
    this._files = null;
    this._cancelFn = null;
    this._initState = {
      uploading: false, // Is in Uploading Progress
      pace: '0%', // Current File Uploading Progress
      current: 0, // Current Uploading file
      total: 1, // total Uploading files length
      thumbnail: null, // Current Uploading thumbnail
    };
    this.state = this._initState;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.open) {
      this.setState(this._initState);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(this.state) !== JSON.stringify(nextState);
  }

  _handleImageChange = (e) => {
    this._files = [...e.target.files];
    this.prepareUpload();
  }

  prepareUpload() {
    const currentFile = this._files[this.state.current];
    const currentImage = new Image();
    const thumbnail = URL.createObjectURL(currentFile);
    currentImage.src = thumbnail;
    currentImage.onload = () => {
      const width = currentImage.naturalWidth || currentImage.width;
      const height = currentImage.naturalHeight || currentImage.height;
      const dimension = [width, height];
      this.setState(
        (prevState) => ({
          uploading: true,
          current: prevState.current + 1,
          total: this._files.length,
          thumbnail,
        }),
        () => {
          currentFile.dimension = dimension;
          if (this.props.beforeUpload) {
            this.props.beforeUpload(this.state, currentFile, this._files);
          }
          this.uploadToQiniu(currentFile);
        },
      );
    };
  }

  uploadToQiniu(currentFile) {
    const { token, prefix } = this.props;

    const fileName = uuid.v4();
    const extension = MIMEToExtension(currentFile.type);

    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('key', `${prefix}/${fileName}.${extension}`);
    formData.append('token', token);

    const progressHanlder = (evt) => {
      if (evt.lengthComputable) {
        const percentComplete = evt.loaded / evt.total;
        const pace = `${Math.round(percentComplete * 100)}%`;
        this.setState({ pace });
      }
    };

    axios({
      method: 'POST',
      url: uploadURL,
      data: formData,
      onUploadProgress: progressHanlder,
      cancelToken: new axios.CancelToken((c) => {
        // An executor function receives a cancel function as a parameter
        this._cancelFn = c;
      }),
    })
      .then((res) => {
        if (this.props.afterUpload) {
          return this.props.afterUpload({
            ...this.state,
            ...res.data,
          }, currentFile, this._files);
        }
      })
      .then(() => {
        if (this.state.current !== this.state.total) {
          this.prepareUpload();
        } else {
          this.finishUpload(null);
        }
      })
      .catch((err) => {
        this.finishUpload(err);
      });
  }

  cancelUploading = () => {
    if (
      this._cancelFn &&
      typeof this._cancelFn === 'function'
    ) {
      this._cancelFn();
    }
    if (this.props.onCancel) {
      this.props.onCancel(this.state, this._files);
    }
  }

  finishUpload(err) {
    if (this.props.onFinish) {
      this.props.onFinish(err, this.state, this._files);
    }
    this._files = null;
    this._cancelFn = null;
  }

  render() {
    const { open, title, multiple, accept } = this.props;
    if (open && this.state.uploading) {
      return (
        <UploaderShower
          title={title}
          thumb={this.state.thumbnail}
          message={`第${this.state.current}张, 共${this.state.total}张`}
          progress={this.state.pace}
          onCancel={this.cancelUploading}
        />
      );
    }
    return (
      <input
        id="Uploader"
        className="hide"
        type="file"
        onChange={this._handleImageChange}
        multiple={multiple}
        accept={accept}
      />
    );
  }
}

const mapStateToProps = ({ sessions, portals }) => ({
  open: portals.uploader.open,
  token: sessions.uptoken,
});

export default connect(mapStateToProps, null)(Uploader);
