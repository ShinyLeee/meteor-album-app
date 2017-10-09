import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '/imports/ui/redux/actions';
import NotePage from './Note';

const mapStateToProps = ({ sessions, portals }) => ({
  User: sessions.User,
  bibleDialogOpen: portals.dialog.open,
  bible: portals.dialog.bible,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ match }) => {
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
  }),
)(NotePage);
