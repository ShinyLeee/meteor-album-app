import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import AllCollectionsPage from './AllCollections.jsx';

const preCurUser = Meteor.settings.public.preCurUser;

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true
  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const userHandler = Meteor.subscribe('Users.all');
  const collHandler = Meteor.subscribe('Collections.inUser', username);
  const noteHandler = Meteor.subscribe('Notes.own');
  const dataIsReady = userHandler.ready() && collHandler.ready() && noteHandler.ready();

  let colls;
  const curUser = Meteor.users.findOne({ username }) || preCurUser;
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();

  if (!isGuest) {
    colls = Collections.find({}, { sort: { createdAt: -1 } }).fetch();
  } else {
    colls = Collections.find({ private: false }, { sort: { createdAt: -1 } }).fetch();
  }

  return {
    dataIsReady,
    isGuest,
    curUser,
    colls,
    noteNum,
  };
}, AllCollectionsPage);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
