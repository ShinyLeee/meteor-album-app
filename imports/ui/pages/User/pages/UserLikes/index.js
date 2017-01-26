import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import { Images } from '/imports/api/images/image.js';

import UserLikesPage from './UserLikes.jsx';

const MeteorContainer = createContainer(({ params }) => {
  // Define How many pictures render in the first time
  const limit = 5;

  const { username } = params;

  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true

  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;

  else isGuest = true;
  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = isGuest
                       ? Meteor.subscribe('Images.liked', username)
                       : Meteor.subscribe('Images.liked');
  const dataIsReady = userHandler.ready() && imageHandler.ready();

  const initUserLikedImages = Images.find(
    { private: false, liker: { $in: [username] } },
    { sort: { createdAt: -1 }, limit }
  ).fetch();

  const curUser = Meteor.users.findOne({ username }) || {};

  return {
    limit,
    dataIsReady,
    isGuest,
    curUser,
    initUserLikedImages,
  };
}, UserLikesPage);

const mapStateToProps = (state) => ({
  zoomerOpen: state.zoomer.open,
  zoomerImage: state.zoomer.image,
});

export default connect(mapStateToProps)(MeteorContainer);

