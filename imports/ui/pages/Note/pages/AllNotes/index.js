import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Notes } from '/imports/api/notes/note.js';

import AllNotesPage from './AllNotes.jsx';

export default createContainer(({ params }) => {
  const { username } = params;
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.own', username);
  const dataIsReady = userHandler.ready() && noteHandler.ready();

  const initialAllNotes = Notes.find(
    { receiver: username },
    { sort: { sendAt: -1 }, limit }
).fetch();

  return {
    dataIsReady,
    limit,
    initialAllNotes,
  };
}, AllNotesPage);
