import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import NotePage from './Note.jsx';

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.own', username);
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

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
