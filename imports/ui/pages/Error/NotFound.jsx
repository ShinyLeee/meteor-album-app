import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';

export default class NotFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '404',
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
            <h2 className="Error__status">Error: 404 Page Not Found</h2>
            <img
              className="Error__logo"
              src={`${this.props.sourceDomain}/GalleryPlus/Error/404.png`}
              alt="404 Not Found"
            />
            <p className="Error__info">您访问的这个页面不存在</p>
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


NotFound.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

NotFound.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  noteNum: PropTypes.number.isRequired,
};
