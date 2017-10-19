import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '/imports/api/users/user';
import { Collections } from '/imports/api/collections/collection';
import { Notes } from '/imports/api/notes/note';

import ResultsContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ match }) => {
  const { query } = match.params;

  const userHandler = Meteor.subscribe('Users.all');
  const collHandler = Meteor.subscribe('Collections.all');
  const noteHandler = Meteor.subscribe('Notes.receiver');
  const dataIsReady = userHandler.ready() && collHandler.ready() && noteHandler.ready();

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
    dataIsReady,
    users,
    collections,
    notes,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTracker(trackHandler),
)(ResultsContent);
