import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import NavHeader from '../../components/NavHeader.jsx';

export default class NotFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '404',
    };
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">Error: 404 Page Not Found</h2>
            <img className="Error__logo" src="/img/404.png" alt="404 Not Found" />
            <p className="Error__info">Sorry, the page you're looing for cannot be accessed.</p>
            <p className="Error__info">
              Either check the URL,&nbsp;
              <Link to="/">go home</Link>
              , or feel free to&nbsp;
              <Link to="/">report this issue</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

}

NotFound.propTypes = {
  User: PropTypes.object,
};
