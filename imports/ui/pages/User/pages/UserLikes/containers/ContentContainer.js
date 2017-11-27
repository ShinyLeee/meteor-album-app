import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Images } from '/imports/api/images/image';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import UserLikesContent from '../components/Content';

const trackHandler = ({ match }) => {
  // Define How many pictures render in the first time
  const limit = 5;

  const { username } = match.params;
  const imageHandler = Meteor.subscribe('Images.liked', username);
  const isDataReady = imageHandler.ready();

  const images = Images.find(
    { private: false, liker: { $in: [username] } },
    { sort: { createdAt: -1 }, limit },
  ).fetch();

  const imagesCount = Images.find({ private: false, deletedAt: null }).count();

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
