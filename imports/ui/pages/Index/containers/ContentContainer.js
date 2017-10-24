import { compose } from 'redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Images } from '/imports/api/images/image';

import IndexPage from '../components/Content';

const trackHandler = () => {
  // Define How many pictures render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = Meteor.subscribe('Images.all');
  const dataIsReady = userHandler.ready() && imageHandler.ready();

  const images = Images.find(
    { private: false, deletedAt: null },
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
)(IndexPage);
