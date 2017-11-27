import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import setDisplayName from 'recompose/setDisplayName';
import { Collections } from '/imports/api/collections/collection';
import FollowingView from '../components/FollowingView';

const trackHandler = ({ User, match }) => {
  const { username: curUserName } = match.params;

  const isOwner = !!User && (User.username === curUserName);

  const collHandler = isOwner
    ? Meteor.subscribe('Collections.ownFollowing')
    : Meteor.subscribe('Collections.inUserFollowing', curUserName);

  const dataIsReady = collHandler.ready();

  const colls = isOwner
    ? Collections.find({ user: { $ne: curUserName } }, { sort: { createdAt: -1 } }).fetch()
    : Collections.find({ user: { $ne: curUserName }, private: false }, { sort: { createdAt: -1 } }).fetch();

  return {
    dataIsReady,
    colls,
  };
};

export default compose(
  setDisplayName('DynamicFollowingViewContainer'),
  withRouter,
  withTracker(trackHandler),
)(FollowingView);
