import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Images } from '/imports/api/images/image.js';
import { Notes } from '/imports/api/notes/note.js';

import IndexPage from '../pages/Index/Index.jsx';

export default createContainer(() => {
  // Define How many pictures render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.all');
  const noteHandler = Meteor.subscribe('Notes.own');
  const imageHandler = Meteor.subscribe('Images.all');
  const dataIsReady = userHandler.ready() && imageHandler.ready() && noteHandler.ready();

  const users = Meteor.users.find().fetch();
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();
  const initialImages = Images.find(
    { private: { $ne: true } },
    { sort: { createdAt: -1 }, limit }
  ).fetch();

  return {
    limit,
    dataIsReady,
    users,
    noteNum,
    initialImages,
  };
}, IndexPage);
