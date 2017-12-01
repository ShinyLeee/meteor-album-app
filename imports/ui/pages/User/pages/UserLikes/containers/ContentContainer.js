import map from 'lodash/map';
import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Images } from '/imports/api/images/image';
import CardLoader from '/imports/ui/components/Loader/CardLoader';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import UserLikesContent from '../components/Content';

const trackHandler = ({ isOwner, match }) => {
  // Define How many pictures render in the first time
  const limit = 5;

  const { username } = match.params;
  const imageHandler = Meteor.subscribe('Images.liked', username);
  const isDataReady = imageHandler.ready();

  const imageSelector = { liker: { $in: [username] }, deletedAt: null };

  if (!isOwner) {
    imageSelector.private = false;
  }

  const images = Images.find(
    imageSelector,
    { sort: { createdAt: -1 }, limit },
  ).fetch();

  const imagesCount = Images.find(imageSelector).count();

  return {
    limit,
    isDataReady,
    images,
    imagesCount,
  };
};

const dataReadyOps = {
  placeholder: map(
    [1, 2, 3],
    (key) => <CardLoader key={key} />,
  ),
};

export default compose(
  setDisplayName('UserLikesContentContainer'),
  withRouter,
  withTracker(trackHandler),
  withDataReadyHandler(dataReadyOps),
)(UserLikesContent);
