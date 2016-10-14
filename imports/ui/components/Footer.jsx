import React, { Component } from 'react';

export default class Footer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'Footer',
    };
  }

  render() {
    return (
      <div className="footer">
        <div className="footer-logo">
          <img src="http://odsiu8xnd.bkt.clouddn.com/vivian/logo.png" alt="Logo" />
        </div>
        <p className="footer-text">Powerd By Shiny Lee</p>
      </div>
    );
  }

}
