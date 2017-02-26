import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import UserFansPage from './UserFans.jsx';

const MeteorContainer = createContainer(({ params }) => {
  const { username } = params;

  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true

  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const userHandler = Meteor.subscribe('Users.all');
  const dataIsReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username });
  const initialFans = isGuest ? (curUser && curUser.profile.followers) : User.profile.followers;

  return {
    dataIsReady,
    isGuest,
    curUser,
    initialFans,
  };
}, UserFansPage);

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(MeteorContainer);
