import React, { Component } from 'react';

export default class Recap extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'index',
      authenticated: true,
    };
  }

  render() {
    return (
      <div className="recap">
        <h1 className="recap-title">Gallery</h1>
        <p className="recap-detail recap-detail-1">Vivian的私人相册</p>
        <p className="recap-detail recap-detail-2">Created By Simon Lee</p>
        <ul className="recap-icons">
          <li>
            <a className="fa fa-github" href="https://github.com/ShinyLeee" data-toggle="tooltip" data-title="Github" />
          </li>
          <li>
            <a className="fa fa-wechat" data-toggle="tooltip" data-title="Wechat" />
          </li>
          <li>
            <a className="fa fa-twitter" href="https://twitter.com/shinylee007" data-toggle="tooltip" data-title="Twitter" />
          </li>
          <li>
            <a className="fa fa-instagram" href="https://www.instagram.com/lshinylee" data-toggle="tooltip" data-title="Instagram" title="Instagram"></a>
          </li>
          <li>
            <a className="fa fa-at" href="http://www.shinylee.cn" data-toggle="tooltip" data-title="Website" />
          </li>
        </ul>
      </div>
    );
  }

}
