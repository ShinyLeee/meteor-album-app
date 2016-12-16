import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import NavHeader from '../../components/NavHeader.jsx';

export default class Forbidden extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '403',
    };
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">Error: 403 Access Denied</h2>
            <img className="Error__logo" src="/img/403.png" alt="403 Access Denied" />
            <p className="Error__info">Sorry, access to this page on the server is denied.</p>
            <p className="Error__info">
              Either check the URL,&nbsp;
              <Link to="/">go home</Link>,or feel free to&nbsp;
              <Link to="/">report this issue</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

}

Forbidden.propTypes = {
  User: PropTypes.object,
};
