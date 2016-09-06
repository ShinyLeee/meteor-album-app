import React, { Component } from 'react';

export default class Publish extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isClick: false,
    };
  }

  render() {
    return (
      <div className="content">
        <div className="publish-holder">
          <div className="upload-drop">
            <div className="upload-drop-box">
              <input className="upload-drop-file" accept="image/jpeg" type="file" required />
            </div>
            <p className="text-right">
              <small className="drop-error pull-left" />
              <small>只接受.jpg文件，且大小不得超过4MB</small>
            </p>
          </div>
          <div className="upload-field">
            <div className="field field-caption">
              <label htmlFor="caption">图片名</label>
              <input id="caption" className="form-control" type="text" name="caption" required />
            </div>
            <div className="field field-tag">
              <label htmlFor="tag">标签</label>
              <input id="tag" className="form-control" type="text" name="tag" required />
            </div>
            <div className="field field-action">
              <button type="submit" className="field-action-button field-action-submit">
                <i className="fa fa-cloud-upload" />提交
              </button>
              <button type="reset" className="field-action-button field-action-reset">重置</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
