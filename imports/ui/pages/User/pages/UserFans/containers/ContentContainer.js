import get from 'lodash/get';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import { snackBarOpen } from '/imports/ui/redux/actions';
import UserFansContent from '../components/Content';

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
  const isDataReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username: curUserName });
  const fans = get(isOwner ? User : curUser, 'profile.followers');

  return {
    isDataReady,
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
  setDisplayName('UserFansContentContainer'),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withStyles(styles),
  withTracker(trackHandler),
  withDataReadyHandler(),
)(UserFansContent);
