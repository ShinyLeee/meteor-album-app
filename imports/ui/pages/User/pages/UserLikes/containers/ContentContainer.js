import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Images } from '/imports/api/images/image';

import UserLikesPage from '../components/Content';

const trackHandler = ({ match }) => {
  // Define How many pictures render in the first time
  const limit = 5;

  const { username } = match.params;
  const imageHandler = Meteor.subscribe('Images.liked', username);
  const dataIsReady = imageHandler.ready();

  const images = Images.find(
    { private: false, liker: { $in: [username] } },
    { sort: { createdAt: -1 }, limit },
  ).fetch();

  const imagesCount = Images.find({ private: false, deletedAt: null }).count();

  return {
    limit,
    dataIsReady,
    images,
    imagesCount,
  };
};

export default compose(
  withRouter,
  withTracker(trackHandler),
)(UserLikesPage);
