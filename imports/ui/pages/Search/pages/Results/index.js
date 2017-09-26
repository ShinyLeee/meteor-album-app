import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/imports/api/users/user.js';
import { Collections } from '/imports/api/collections/collection.js';
import { Notes } from '/imports/api/notes/note.js';

import ResultsPage from './Results.jsx';

const MeteorContainer = createContainer(({ match }) => {
  const query = match.params.query;

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
}, ResultsPage);

export default MeteorContainer;
