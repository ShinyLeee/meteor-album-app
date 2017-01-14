import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Images } from '/imports/api/images/image.js';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '../../redux/actions/index.js';
import IndexPage from '../../pages/Index/index.jsx';

const MeteorContainer = createContainer(() => {
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

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
