import queryString from 'query-string';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';

import SendNoteContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User, location }) => {
  const { receiver } = queryString.parse(location.search);
  const userHandler = Meteor.subscribe('Users.all');
  const dataIsReady = userHandler.ready();

  const otherUsers = Meteor.users.find({ _id: { $ne: User._id } }).fetch();

  return {
    dataIsReady,
    initReceiver: receiver,
    otherUsers,
  };
};

const styles = {
  input: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    padding: '0 20px',
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTracker(trackHandler),
  withStyles(styles),
)(SendNoteContent);
