import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavFooter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: true,
      name: 'NavFooter',
    };
  }

  componentDidMount() {
    window.addEventListener('wheel', this.handleMouseWheel.bind(this));
    window.addEventListener('touchstart', this.handleTouchStart.bind(this));
    window.addEventListener('touchmove', this.handleTouchMove.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('wheel', this.handleMouseWheel.bind(this));
    window.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    window.removeEventListener('touchmove', this.handleTouchMove.bind(this));
  }

  handleMouseWheel(e) {
    const hasScrollBar = document.body.scrollHeight > document.body.clientHeight;
    if (e.deltaY > 0 && !hasScrollBar) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }

  handleTouchStart(e) {
    this.setState({ startPageY: e.changedTouches[0].pageY });
  }

  handleTouchMove(e) {
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
