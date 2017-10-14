import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '/imports/ui/redux/actions';
import AllSentNotes from './AllSentNotes';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withTracker(({ match }) => {
    const { username } = match.params;
    // Define How many notes render in the first time
    const limit = 5;

    const userHandler = Meteor.subscribe('Users.others');
    const noteHandler = Meteor.subscribe('Notes.sender');
    const dataIsReady = userHandler.ready() && noteHandler.ready();

    const initialAllSentNotes = Notes.find(
      { sender: username },
      { sort: { sendAt: -1 }, limit },
    ).fetch();

    return {
      dataIsReady,
      limit,
      initialAllSentNotes,
    };
  }),
)(AllSentNotes);
