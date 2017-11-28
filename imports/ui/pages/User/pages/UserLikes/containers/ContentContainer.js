import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Images } from '/imports/api/images/image';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import UserLikesContent from '../components/Content';

const trackHandler = ({ isOwner, match }) => {
  // Define How many pictures render in the first time
  const limit = 5;

  const { username } = match.params;
  const imageHandler = Meteor.subscribe('Images.liked', username);
  const isDataReady = imageHandler.ready();

  const imageSelector = { liker: { $in: [username] } };
  const countSelector = { deletedAt: null };

  if (!isOwner) {
    imageSelector.private = false;
    countSelector.private = false;
  }

  const images = Images.find(
    imageSelector,
    { sort: { createdAt: -1 }, limit },
  ).fetch();

  const imagesCount = Images.find(countSelector).count();

  return {
    limit,
    isDataReady,
    images,
    imagesCount,
  };
};

export default compose(
  setDisplayName('UserLikesContentContainer'),
  withRouter,
  withTracker(trackHandler),
  withDataReadyHandler(),
)(UserLikesContent);
