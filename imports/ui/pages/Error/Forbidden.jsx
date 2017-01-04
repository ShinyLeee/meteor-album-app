import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Notes } from '/imports/api/notes/note.js';
import ConnectedNavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';

const sourceDomain = Meteor.settings.public.sourceDomain;

class Forbidden extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '403',
    };
  }

  render() {
    const { User, noteNum, location } = this.props;
    return (
      <div className="container">
        <ConnectedNavHeader User={User} location={this.state.location} noteNum={noteNum} primary />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">Error: 403 Access Denied</h2>
            <img className="Error__logo" src={`${sourceDomain}/GalleryPlus/Error/403.png`} alt="403 Access Denied" />
            <p className="Error__info">您没有权限访问该页面</p>
            {
              (location.state && location.state.message)
                ? (<p className="Error__info">{location.state.message}</p>)
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

Forbidden.propTypes = {
  User: PropTypes.object,
  noteNum: PropTypes.number.isRequired,
  location: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, Forbidden);
