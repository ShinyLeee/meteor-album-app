import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '/imports/api/users/user';
import { Collections } from '/imports/api/collections/collection';
import { Notes } from '/imports/api/notes/note';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import SearchResultsContent from '../components/Content';

const trackHandler = ({ match }) => {
  const { query } = match.params;

  const userHandler = Meteor.subscribe('Users.all');
  const collHandler = Meteor.subscribe('Collections.all');
  const noteHandler = Meteor.subscribe('Notes.receiver');
  const isDataReady = userHandler.ready() && collHandler.ready() && noteHandler.ready();

  const regex = new RegExp(`^${query}`, 'i');
  const noteRegex = new RegExp(query, 'i');

  const users = Users.find({ username: { $regex: regex } }).fetch();
  const collections = Collections.find({
    $or: [
      { user: { $regex: regex }, private: false },
      { name: { $regex: regex }, private: false },
    ],
  }).fetch();
  const notes = Notes.find({ content: { $regex: noteRegex } }).fetch();

  return {
    isDataReady,
    users,
    collections,
    notes,
  };
};

export default compose(
  setDisplayName('SearchResultsContentContainer'),
  withRouter,
  withTracker(trackHandler),
  withDataReadyHandler(),
)(SearchResultsContent);
