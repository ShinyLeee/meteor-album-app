import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '/imports/ui/redux/actions';
import UserFansPage from './UserFans';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ User, match }) => {
    const { username } = match.params;

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
  }),
)(UserFansPage);
