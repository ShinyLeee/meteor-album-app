import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Notes } from '/imports/api/notes/note.js';
import ConnectedNavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';

const sourceDomain = Meteor.settings.public.source;

class NotFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: '404',
    };
  }

  render() {
    const { User, noteNum } = this.props;
    return (
      <div className="container">
        <ConnectedNavHeader User={User} location={this.state.location} noteNum={noteNum} primary />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">Error: 404 Page Not Found</h2>
            <img className="Error__logo" src={`${sourceDomain}/GalleryPlus/Error/404.png`} alt="404 Not Found" />
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

NotFound.propTypes = {
  User: PropTypes.object,
  noteNum: PropTypes.number.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, NotFound);
