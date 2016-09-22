import React, { Component, PropTypes } from 'react';

export default class Recap extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'Recap',
    };
  }

  render() {
    return (
      <div className="recap">
        <h1 className="recap-title">{this.props.title}</h1>
        <p className="recap-detail recap-detail-1">{this.props.detailFir}</p>
        <p className="recap-detail recap-detail-2">{this.props.detailSec}</p>
        <ul className="recap-icons">
          <li>
            <a className="fa fa-github" href="https://github.com/ShinyLeee" data-toggle="tooltip" data-title="Github" title="Github" />
          </li>
          <li>
            <a className="fa fa-wechat" data-toggle="tooltip" data-title="Wechat" title="Wechat" />
          </li>
          <li>
            <a className="fa fa-twitter" href="https://twitter.com/shinylee007" data-toggle="tooltip" data-title="Twitter" title="Twitter" />
          </li>
          <li>
            <a className="fa fa-instagram" href="https://www.instagram.com/lshinylee" data-toggle="tooltip" data-title="Instagram" title="Instagram" />
          </li>
          <li>
            <a className="fa fa-at" href="http://www.shinylee.cn" data-toggle="tooltip" data-title="Website" title="Website" />
          </li>
        </ul>
      </div>
    );
  }
}

Recap.propTypes = {
  title: PropTypes.string.isRequired,
  detailFir: PropTypes.string.isRequired,
  detailSec: PropTypes.string,
};
