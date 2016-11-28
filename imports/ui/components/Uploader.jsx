import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import uuid from 'node-uuid';

import { insertImage } from '/imports/api/images/methods.js';
import { uploaderStop, snackBarOpen } from '../actions/actionTypes.js';

class Uploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pace: 0,               // Current File Uploading Progress
      current: 0,           // Current Uploading file
      total: 1,            // total Uploading files length
      thumbnail: '',      // Current Uploading thumbnail
      uploading: false,  // Is in Uploading Progress
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    e.preventDefault();
    const files = [...e.target.files];
    this.setState({
      total: files.length,
      uploading: true,
    }, () => {
      this.uploadToQiniu(files);
    });
  }

  uploadToQiniu(files, currentFile) {
    if (!files) {
      console.log('File is empty, Please check out your file'); // eslint-disable-line no-console
      return;
    }

    const { destination, token, uploadURL } = this.props;

    let f = null;
    const formData = new FormData();
    const fileName = uuid.v4();

    f = currentFile || files[0];

    this.setState({
      current: this.state.current + 1,
      thumbnail: URL.createObjectURL(f),
    }, () => {
      formData.append('file', f);
      formData.append('key', `${destination}${fileName}.${f.name.split('.')[1]}`);
      formData.append('token', token);
      $.ajax({
        xhr: () => {
          const xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener('progress', (evt) => {
            this.fileUploading(evt, xhr);
          }, false);
          xhr.addEventListener('progress', (evt) => {
            this.fileUploading(evt, xhr);
          }, false);
          return xhr;
        },
        beforeSend: () => {
          const img = new Image();
          img.onload = function onImageLoad() {
            const width = this.naturalWidth || this.width;
            const height = this.naturalHeight || this.height;
            let ratio = width / height;
            ratio = Math.round(ratio * 100) / 100;
            f.ratio = ratio;
            f.shootAt = f.lastModified;
          };
          img.src = this.state.thumbnail;
        },
        method: 'POST',
        url: uploadURL,
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
      })
      .success((res) => {
        f.key = res.key;
        if (this.afterUploadFile(f)) {
          if (this.state.current === this.state.total) {
            this.finishUpload(null);
          } else {
            this.uploadToQiniu(files, files[this.state.current]);
          }
        }
      })
      .error((err) => {
        this.finishUpload(err);
      });
    });
  }

  fileUploading(e, xhr) {
    if (this.stopButton) {
      this.stopButton.addEventListener('click', (event) => {
        this.stopUploading(event, xhr);
      }, false);
    }
    if (e.lengthComputable) {
      const percentComplete = e.loaded / e.total;
      const pace = `${Math.round(percentComplete * 100)}%`;
      this.setState({ pace });
      console.log(pace); // eslint-disable-line no-console
    }
  }

  afterUploadFile(file) {
    const { User, domain, destination, dispatch } = this.props;
    const uid = User._id;
    const url = `${domain}/${file.key}`;
    const ratio = file.ratio;
    const shootAt = file.shootAt;
    const collection = destination.split('/')[1];
    const image = {
      uid,
      url,
      ratio,
      shootAt,
      collection,
    };
    return insertImage.call(image, (err) => {
      if (err) {
        dispatch(uploaderStop());
        dispatch(snackBarOpen(err.message));
      }
      // console.log(file, image);
    });
  }

  finishUpload(err) {
    const { dispatch } = this.props;
    const { current } = this.state;
    if (err) {
      this.setState({
        pace: 0,
        current: 0,
        total: 1,
        thumbnail: '',
        uploading: false,
      });
      dispatch(uploaderStop());
      dispatch(snackBarOpen('上传失败'));
      console.log(err); // eslint-disable-line no-console
      return;
    }
    const successMsg = `成功上传${current}个文件`;

    this.setState({
      pace: 0,
      current: 0,
      total: 1,
      thumbnail: '',
      uploading: false,
    });
    dispatch(uploaderStop());
    dispatch(snackBarOpen(successMsg));
    console.log('Upload Success'); // eslint-disable-line no-console
  }

  stopUploading(e, xhr) {
    const { dispatch } = this.props;
    e.preventDefault();
    if (xhr && xhr.readyState !== 4) {
      xhr.abort();
      const stopMsg = `您取消了上传文件, 已成功上传${this.state.current}个文件`;
      this.setState({
        pace: 0,
        current: 0,
        total: 1,
        thumbnail: '',
        uploading: false,
      });
      dispatch(uploaderStop());
      dispatch(snackBarOpen(stopMsg));
    }
  }

  render() {
    const {
      open,
      destination,
      multiple,
    } = this.props;

    const {
      pace,
      total,
      current,
      uploading,
      thumbnail,
    } = this.state;

    if (open && uploading) {
      return (
        <div>
          <div className="uploader-wrapper">
            <div className="uploader">
              <div className="thumbnails" style={{ backgroundImage: `url(${thumbnail})` }} />
              <div className="details">
                <span>正在上传至</span>
                <h4>{ destination.split('/')[1] }</h4>
                <span>第{current}张, 共{total}张</span>
                <a className="stop" ref={(ref) => { this.stopButton = ref; }}>停止</a>
                <div className="pace" style={{ width: pace }} />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <input
          id="uploader"
          type="file"
          style={{ display: 'none' }}
          onChange={this.handleOnChange}
          ref={(ref) => { this.filesInput = ref; }}
          multiple={multiple}
        />
      </div>
    );
  }
}

Uploader.defaultProps = {
  open: false,
  multiple: false,
  uploadURL: window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com',
  domain: 'http://o97tuh0p2.bkt.clouddn.com',
};

Uploader.propTypes = {
  /**
   * User:
   *
   * Pass from Parent Component
   */
  User: PropTypes.object,
  /**
   * open:
   *
   * Is Uploader Component open.
   */
  open: PropTypes.bool.isRequired,
  /**
   * destination:
   *
   * Compose by Username and Collection name,
   * eg: ShinyLee/风景.
   */
  destination: PropTypes.string,
  /**
   * token:
   *
   * Qiniu token.
   */
  token: PropTypes.string,
  /**
   * uploadURL:
   *
   * Qiniu upload url,
   * eg: https://up.qbox.me/, http://upload.qiniu.com.
   */
  uploadURL: PropTypes.string.isRequired,
  /**
   * domain:
   *
   * eg: o97tuh0p2.bkt.clouddn.com
   */
  domain: PropTypes.string.isRequired,
  /**
   * multiple:
   *
   * Is support upload multiple files
   */
  multiple: PropTypes.bool.isRequired,
  /**
   * dispatch:
   *
   * Function that inherit from react-redux
   */
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => {
  const uploader = state.uploader;
  if (uploader) {
    return {
      open: uploader.open,
      token: uploader.uptoken,
      destination: uploader.key,
    };
  }
  return { open: false };
};

export default connect(mapStateToProps)(Uploader);
