import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note';

import { snackBarOpen } from '/imports/ui/redux/actions';
import AllNotesContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(() => {
    // Define How many notes render in the first time
    const limit = 5;

    const userHandler = Meteor.subscribe('Users.others');
    const noteHandler = Meteor.subscribe('Notes.receiver');
    const dataIsReady = userHandler.ready() && noteHandler.ready();

    const notes = Notes.find({}, {
      sort: { sendAt: -1 }, limit,
    }).fetch();

    return {
      dataIsReady,
      limit,
      notes,
    };
  }),
)(AllNotesContent);
