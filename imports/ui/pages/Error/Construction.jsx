import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Notes } from '/imports/api/notes/note.js';
import NavHeader from '../../components/NavHeader.jsx';

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
            <p className="Error__info">Sorry, the page you're looing for cannot be accessed temporarily.</p>
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
