import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Notes } from '/imports/api/notes/note.js';

import AllSentNotes from './AllSentNotes.jsx';

export default createContainer(({ params }) => {
  const { username } = params;
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.sender');
  const dataIsReady = userHandler.ready() && noteHandler.ready();

  const initialAllSentNotes = Notes.find(
    { sender: username },
    { sort: { sendAt: -1 }, limit }
).fetch();

  return {
    dataIsReady,
    limit,
    initialAllSentNotes,
  };
}, AllSentNotes);
