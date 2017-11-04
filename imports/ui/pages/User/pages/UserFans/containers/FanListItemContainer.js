import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

import FanListItem from '../components/FanListItem';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User, fan: fanName, match }) => {
  const { username: curUserName } = match.params;

  const isOwner = !!User && (User.username === curUserName);
  const userHandler = Meteor.subscribe('Users.all');
  const dataIsReady = userHandler.ready();
  const fan = Meteor.users.findOne({ username: fanName });

  return {
    dataIsReady,
    isOwner,
    fan,
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
  connect(mapStateToProps),
  withTracker(trackHandler),
  withStyles(styles),
)(FanListItem);
