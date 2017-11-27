import { compose } from 'redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Images } from '/imports/api/images/image';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import IndexContent from '../components/Content';

const trackHandler = () => {
  // Define How many pictures render in the first time
  const limit = 5;

  const imageHandler = Meteor.subscribe('Images.all');
  const isDataReady = imageHandler.ready();

  const images = Images.find(
    { private: false, deletedAt: null },
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
  setDisplayName('IndexContentContainer'),
  withRouter,
  withTracker(trackHandler),
  withDataReadyHandler(),
)(IndexContent);
