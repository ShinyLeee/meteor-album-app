import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Collections } from '/imports/api/collections/collection';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';

import CollectionContent from '../components/Content';

const trackHandler = ({ match }) => {
  const { username: curUserName, cname: curCName } = match.params;

  const dataHandler = Meteor.subscribe('Images.inCollection', { username: curUserName, cname: curCName });
  const isDataReady = dataHandler.ready();

  // curColl is currentCollection use for lock/remove etc.
  const curColl = Collections.findOne({ name: curCName });
  const images = curColl.images().fetch();

  return {
    isDataReady,
    images,
  };
};

export default compose(
  setDisplayName('CollectionContentContainer'),
  withRouter,
  withTracker(trackHandler),
  withDataReadyHandler(),
)(CollectionContent);
