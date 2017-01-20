import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';
import { Images } from '/imports/api/images/image.js';

import { snackBarOpen } from '../../redux/actions/index.js';
import UserPage from './User.jsx';

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;
  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true

  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = Meteor.subscribe('Images.all');
  const collectionHandler = Meteor.subscribe('Collections.inUser', username);

  let dataIsReady = false;
  let unOrderedImages = [];
  let likedCount = 0;
  let collectionCount = 0;
  const userIsReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username }) || {};

  if (userIsReady) {
    dataIsReady = imageHandler.ready() && collectionHandler.ready();
    collectionCount = Collections.find().count();
    likedCount = Images.find({ liker: { $in: [curUser._id] } }).count();
    unOrderedImages = Images.find(
      { user: curUser.username },
      { limit: 10 }
    ).fetch();
  }

  return {
    dataIsReady,
    isGuest,
    curUser,
    unOrderedImages,
    likedCount,
    collectionCount,
  };
}, UserPage);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
