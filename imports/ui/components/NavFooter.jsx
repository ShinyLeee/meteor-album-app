import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: true,
      name: 'NavFooter',
    };
    this._handleMouseWheel = this._handleMouseWheel.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
  }

  componentDidMount() {
    window.addEventListener('wheel', this._handleMouseWheel);
    window.addEventListener('touchstart', this._handleTouchStart);
    window.addEventListener('touchmove', this._handleTouchMove);
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this._handleMouseWheel);
    window.removeEventListener('touchstart', this._handleTouchStart);
    window.removeEventListener('touchmove', this._handleTouchMove);
  }

  _handleMouseWheel(e) {
    const hasScrollBar = document.body.scrollHeight > document.body.clientHeight;
    if (e.deltaY > 0 && !hasScrollBar) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }

  _handleTouchStart(e) {
    this.setState({ startPageY: e.changedTouches[0].pageY });
  }

  _handleTouchMove(e) {
    this.setState({ endPageY: e.changedTouches[0].pageY });
    if (this.state.startPageY - this.state.endPageY > 0) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }

  render() {
    return (
      <nav
        className={`nav-footer ${this.state.show ? 'nav-footer-pinned' : 'nav-footer-unpinned'}`}
      >
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
