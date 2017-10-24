import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note';

import AllSentNotesContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User }) => {
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.sender');
  const dataIsReady = userHandler.ready() && noteHandler.ready();

  const notes = Notes.find(
    { sender: User.username },
    { sort: { sendAt: -1 }, limit },
  ).fetch();

  const notesNum = Notes.find({ sender: User.username }).count();

  return {
    dataIsReady,
    limit,
    notes,
    notesNum,
  };
};

export default compose(
  connect(mapStateToProps),
  withTracker(trackHandler),
)(AllSentNotesContent);
