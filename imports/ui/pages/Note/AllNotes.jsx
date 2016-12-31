import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { blue500 } from 'material-ui/styles/colors';
import scrollTo from '/imports/utils/scrollTo.js';
import { Notes } from '/imports/api/notes/note.js';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import NoteHolder from '/imports/ui/components/Note/NoteHolder.jsx';

const styles = {
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

class AllNotesPage extends Component {

  renderNotes() {
    const { User, otherUsers, AllNotes } = this.props;
    if (AllNotes.length === 0) {
      return (
        <div className="Empty">
          <div className="Empty__container">
            <img className="Empty__logo" src="/img/empty.png" role="presentation" />
            <h2 className="Empty__header">Oops!</h2>
            <p className="Empty__info">您还未收到消息</p>
          </div>
        </div>
      );
    }
    return (
      <div className="note">
        {
          AllNotes.map((note) => otherUsers.map((user) => note.sender === user._id &&
          (
            <NoteHolder
              User={User}
              sender={user}
              note={note}
              isRead
            />
          )))
        }
      </div>
    );
  }

  render() {
    const { User, dataIsReady } = this.props;
    return (
      <div className="container">
        <NavHeader
          User={User}
          title="全部消息"
          style={{ backgroundColor: blue500 }}
          onTitleTouchTap={() => scrollTo(0, 1500)}
          iconElementLeft={
            <IconButton onTouchTap={() => browserHistory.goBack()}>
              <ArrowBackIcon />
            </IconButton>
          }
        />
        <div className="content">
          {
            dataIsReady
            ? this.renderNotes()
            : (<LinearProgress style={styles.indeterminateProgress} mode="indeterminate" />)
          }
        </div>
      </div>
    );
  }

}

AllNotesPage.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  otherUsers: PropTypes.array.isRequired,
  AllNotes: PropTypes.array.isRequired,
  dispatch: PropTypes.func,
};

const MeteorContainer = createContainer(() => {
  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.own');
  const dataIsReady = userHandler.ready() && noteHandler.ready();
  const otherUsers = Meteor.users.find({}).fetch();
  const AllNotes = Notes.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    dataIsReady,
    otherUsers,
    AllNotes,
  };
}, AllNotesPage);

export default connect()(MeteorContainer);
