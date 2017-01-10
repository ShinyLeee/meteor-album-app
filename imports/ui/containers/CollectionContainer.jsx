import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '../redux/actions/creators.js';
import CollectionPage from '../pages/Collection/Collection.jsx';

const preCurUser = Meteor.settings.public.preCurUser;

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true
  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const userHandler = Meteor.subscribe('Users.all');
  const colHandler = Meteor.subscribe('Collections.inUser', username);
  const noteHandler = Meteor.subscribe('Notes.own');
  const dataIsReady = userHandler.ready() && colHandler.ready() && noteHandler.ready();

  let cols;
  const curUser = Meteor.users.findOne({ username }) || preCurUser;
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();

  if (!isGuest) {
    cols = Collections.find({}, { sort: { createdAt: -1 } }).fetch();
  } else {
    cols = Collections.find({ private: false }, { sort: { createdAt: -1 } }).fetch();
  }

  return {
    dataIsReady,
    isGuest,
    curUser,
    cols,
    noteNum,
  };
}, CollectionPage);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
