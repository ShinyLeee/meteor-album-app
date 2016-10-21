import React, { Component } from 'react';
import { Link } from 'react-router';

// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
// import IconButton from 'material-ui/IconButton/IconButton';
// import MenuIcon from 'material-ui/svg-icons/navigation/menu';

export default class NavFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: true,
      location: 'index',
    };
    this._handleMouseWheel = this._handleMouseWheel.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._locationChange = this._locationChange.bind(this);
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

  _locationChange(location) {
    this.setState({ location });
  }

  render() {
    return (
      <nav
        className={`nav-footer ${this.state.show ? 'nav-footer-pinned' : 'nav-footer-unpinned'}`}
      >
        <ul>
          <li>
            <Link
              to="/"
              className={`${this.state.location === 'index' ? 'active' : ''}`}
              onClick={() => this._locationChange('index')}
            ><i className="fa fa-home" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link
              to="/explore"
              className={`${this.state.location === 'explore' ? 'active' : ''}`}
              onClick={() => this._locationChange('explore')}
            ><i className="fa fa-paper-plane" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link
              to="/archive"
              className={`${this.state.location === 'archive' ? 'active' : ''}`}
              onClick={() => this._locationChange('archive')}
            ><i className="fa fa-archive" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link
              to="/search"
              className={`${this.state.location === 'search' ? 'active' : ''}`}
              onClick={() => this._locationChange('search')}
            ><i className="fa fa-search" aria-hidden="true" /></Link>
          </li>
          <li>
            <Link
              to="/404"
              className={`${this.state.location === '404' ? 'active' : ''}`}
              onClick={() => this._locationChange('404')}
            ><i className="fa fa-bars" aria-hidden="true" /></Link>
          </li>
        </ul>
      </nav>
    );
  }

}
