import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import AllNotesPage from './AllNotes.jsx';

const MeteorContainer = createContainer(({ match }) => {
  const { username } = match.params;
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.receiver');
  const dataIsReady = userHandler.ready() && noteHandler.ready();

  const initialAllNotes = Notes.find(
    { receiver: username },
    { sort: { sendAt: -1 }, limit }
).fetch();

  return {
    dataIsReady,
    limit,
    initialAllNotes,
  };
}, AllNotesPage);

const mapStateToProps = (state) => ({
  User: state.User,
  bibleDialogOpen: state.dialog.open,
  bible: state.dialog.bible,
});

export default connect(mapStateToProps)(MeteorContainer);
