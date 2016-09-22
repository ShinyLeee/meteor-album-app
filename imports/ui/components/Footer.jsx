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
          <img src="http://o97tuh0p2.bkt.clouddn.com/vivian/assets/logo.png" alt="Logo" />
        </div>
        <p className="footer-text">Powerd By Shiny Lee</p>
      </div>
    );
  }

}
