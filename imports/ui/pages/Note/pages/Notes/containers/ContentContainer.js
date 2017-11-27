import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setDisplayName } from 'recompose';
import { Notes } from '/imports/api/notes/note';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import NotesContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User }) => {
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.receiver');
  const isDataReady = userHandler.ready() && noteHandler.ready();

  const notes = Notes.find(
    { isRead: { $ne: true }, receiver: User.username },
    { sort: { sendAt: -1 }, limit },
  ).fetch();

  const notesNum = Notes.find({ receiver: User.username, isRead: { $ne: true } }).count();

  return {
    isDataReady,
    limit,
    notes,
    notesNum,
  };
};

export default compose(
  setDisplayName('NotesContentContainer'),
  connect(mapStateToProps),
  withTracker(trackHandler),
  withDataReadyHandler({ loose: true }),
)(NotesContent);
