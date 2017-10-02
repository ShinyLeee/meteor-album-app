import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '/imports/ui/redux/actions';
import NotePage from './Note';

const MeteorContainer = createContainer(({ match }) => {
  const { username } = match.params;
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.receiver');
  const dataIsReady = userHandler.ready() && noteHandler.ready();

  const initialNotes = Notes.find(
    { receiver: username, isRead: { $ne: true } },
    { sort: { sendAt: -1 }, limit }
  ).fetch();

  return {
    dataIsReady,
    limit,
    initialNotes,
  };
}, NotePage);

const mapStateToProps = (state) => ({
  User: state.User,
  bibleDialogOpen: state.dialog.open,
  bible: state.dialog.bible,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
