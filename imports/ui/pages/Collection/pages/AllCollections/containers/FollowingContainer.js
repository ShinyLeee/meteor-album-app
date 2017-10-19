import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Collections } from '/imports/api/collections/collection';
import FollowingView from '../components/FollowingView';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User, match }) => {
  const { username: curUserName } = match.params;

  const isOwner = !!User && (User.username === curUserName);

  const userHandler = Meteor.subscribe('Users.all');
  const collHandler = isOwner
    ? Meteor.subscribe('Collections.ownFollowing')
    : Meteor.subscribe('Collections.inUserFollowing', curUserName);

  const dataIsReady = userHandler.ready() && collHandler.ready();

  let colls;

  if (isOwner) {
    colls = Collections.find({ user: { $ne: curUserName } }, { sort: { createdAt: -1 } }).fetch();
  } else {
    colls = Collections.find({ user: { $ne: curUserName }, private: false }, { sort: { createdAt: -1 } }).fetch();
  }

  return {
    dataIsReady,
    colls,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTracker(trackHandler),
)(FollowingView);
