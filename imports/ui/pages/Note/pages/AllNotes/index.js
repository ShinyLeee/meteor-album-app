import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Notes } from '/imports/api/notes/note.js';

import AllNotesPage from './AllNotes.jsx';

export default createContainer(({ params }) => {
  const { username } = params;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.own', username);
  const dataIsReady = userHandler.ready() && noteHandler.ready();
  const otherUsers = Meteor.users.find({}).fetch();
  const AllNotes = Notes.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    dataIsReady,
    otherUsers,
    AllNotes,
  };
}, AllNotesPage);
