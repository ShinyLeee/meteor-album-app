import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

import { snackBarOpen } from '/imports/ui/redux/actions';
import UserFansPage from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const trackHandler = ({ User, match }) => {
  const { username } = match.params;

  let isGuest = !User; // if User is null, isGuest is true

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
};

const styles = {
  btn__blue: {
    backgroundColor: blue.A400,
    color: '#fff',
    '&:hover': {
      backgroundColor: blue.A200,
    },
  },

  btn__white: {
    backgroundColor: '#fff',
    color: '#000',
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackHandler),
  withStyles(styles),
)(UserFansPage);
