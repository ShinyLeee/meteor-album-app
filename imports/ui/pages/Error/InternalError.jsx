import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';

export default class InternalError extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '500',
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
            <h2 className="Error__status">Error: 500 Unexpected Error</h2>
            <img
              className="Error__logo"
              src={`${this.props.sourceDomain}/GalleryPlus/Error/500.png`}
              alt="500 Unexpected Error"
            />
            <p className="Error__info">服务器内部发生错误</p>
            <p className="Error__info">
              请检查地址是否输入正确&nbsp;
              <Link to="/">返回首页</Link>，或向管理员汇报这个问题
            </p>
          </div>
        </div>
      </div>
    );
  }

}

InternalError.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

InternalError.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  noteNum: PropTypes.number.isRequired,
};
