import React, { Component } from 'react';

export default class PicHolder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'index',
      authenticated: true,
    };
  }

  render() {
    return (
      <div className="pic-holder">
        <div className="pic-holder-info">
          <a>最近的<span className="caret" /></a>
        </div>
        <div className="pic-holder-pic">
          <a>
            <img src="/img/欧洲景色.jpg" alt="pic1" />
          </a>
        </div>
        <div className="pic-holder-action">
          <div className="pull-left">
            <a className="pic-holder-action-left">
              <i className="fa fa-heart" />
              <span>20</span>
            </a>
            <a>
              <span className="fa fa-plus" />
            </a>
          </div>
          <div className="pull-right">
            <a className="pic-holder-action-right">
              <span className="fa fa-download" />
            </a>
          </div> {/* ACTION RIGHT */}
        </div> {/* PIC-HOLDER ACTION */}
      </div> /* PIC-HOLDER */
    );
  }

}
