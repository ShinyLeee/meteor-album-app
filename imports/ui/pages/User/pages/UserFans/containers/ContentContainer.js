import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
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
  const { username: curUserName } = match.params;

  const isOwner = !!User && (User.username === curUserName);
  const userHandler = Meteor.subscribe('Users.all');
  const dataIsReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username: curUserName });
  const fans = get(isOwner ? User : curUser, 'profile.followers');

  return {
    dataIsReady,
    curUser,
    fans,
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
