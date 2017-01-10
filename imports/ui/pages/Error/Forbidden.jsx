import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';

export default class Forbidden extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '403',
    };
  }

  render() {
    return (
      <div className="container">
        <ConnectedNavHeader
          User={this.props.User}
          location={this.state.location}
          noteNum={this.props.noteNum}
          primary
        />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">Error: 403 Access Denied</h2>
            <img
              className="Error__logo"
              src={`${this.props.sourceDomain}/GalleryPlus/Error/403.png`}
              alt="403 Access Denied"
            />
            <p className="Error__info">您没有权限访问该页面</p>
            {
              (this.props.location.state && this.props.location.state.message)
                ? (<p className="Error__info">{this.props.location.state.message}</p>)
                : (
                  <p className="Error__info">
                    请检查地址是否输入正确&nbsp;
                    <Link to="/">返回首页</Link>，或向管理员汇报这个问题
                  </p>
                )
            }
          </div>
        </div>
      </div>
    );
  }

}

Forbidden.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

Forbidden.propTypes = {
  User: PropTypes.object,
  location: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  noteNum: PropTypes.number.isRequired,
  snackBarOpen: PropTypes.func.isRequired,
};
