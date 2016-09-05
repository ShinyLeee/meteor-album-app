import React, { Component } from 'react';
import { Link } from 'react-router';

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
            <Link to="/"><i className="fa fa-home" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link to="/explore"><i className="fa fa-paper-plane" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link to="/archive"><i className="fa fa-archive" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link to="/search"><i className="fa fa-search" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link to="/404"><i className="fa fa-bars" aria-hidden="true" /></Link>
          </li>
        </ul>
      </nav>
    );
  }

}
