import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class NavHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'NavHeader',
    };
  }

  render() {
    let userBtn;
    if (Meteor.loggingIn() || Meteor.user()) userBtn = <Link to="/user" className="nav-header-user pull-right"><img src="http://odsiu8xnd.bkt.clouddn.com/vivian/extra-large.jpg" alt="avatar" /></Link>;
    else userBtn = <Link to="/login" className="nav-header-submit pull-right">登录</Link>;

    return (
      <div className="nav-header">
        <Link to="/upload" className="nav-header-submit pull-left">
          发布图片
        </Link>
        <Link to="/" className="nav-header-logo">
          <img src="http://odsiu8xnd.bkt.clouddn.com/vivian/logo.png" alt="logo" />
        </Link>
        {userBtn}
      </div>
    );
  }

}

// If contextTypes is not defined, then context will be an empty object.
NavHeader.contextTypes = {
  router: PropTypes.object.isRequired,
};
