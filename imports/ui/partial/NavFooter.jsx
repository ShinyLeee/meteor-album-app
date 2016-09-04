import React, { Component } from 'react';

export default class NavFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'index',
    };
  }

  render() {
    return (
      <nav className="nav-footer">
        <ul>
          <li>
            <a href="/"><i className="fa fa-home" aria-hidden="true" /></a>
          </li>
          <li>
            <a href="/"><i className="fa fa-paper-plane" aria-hidden="true" /></a>
          </li>
          <li>
            <a href="/"><i className="fa fa-archive" aria-hidden="true" /></a>
          </li>
          <li>
            <a href="/"><i className="fa fa-search" aria-hidden="true" /></a>
          </li>
          <li>
            <a href="/"><i className="fa fa-bars" aria-hidden="true" /></a>
          </li>
        </ul>
      </nav>
    );
  }

}
