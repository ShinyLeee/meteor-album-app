import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import NavHeader from '../../components/NavHeader.jsx';

export default class InternalError extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '500',
    };
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">Error: 500 Unexpected Error</h2>
            <img className="Error__logo" src="/img/500.png" alt="500 Unexpected Error" />
            <p className="Error__info">An error occured, and your request cound't be completed.</p>
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

InternalError.propTypes = {
  User: PropTypes.object,
};
