import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Notes } from '/imports/api/notes/note.js';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';

class Construction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'Construction',
    };
  }

  render() {
    const { User, noteNum } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} noteNum={noteNum} primary />
        <div className="content Error">
          <div className="Error__container">
            <h2 className="Error__status">This Page is Under Construction</h2>
            <img className="Error__logo" src="/img/Construction.png" alt="Under Construction" />
            <p className="Error__info">该页面正在紧张的开发中</p>
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

Construction.propTypes = {
  User: PropTypes.object,
  noteNum: PropTypes.number.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  return {
    noteNum,
  };
}, Construction);
