import queryString from 'query-string';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import SendNoteContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User, location }) => {
  const { receiver } = queryString.parse(location.search);
  const userHandler = Meteor.subscribe('Users.all');
  const isDataReady = userHandler.ready();

  const otherUsers = Meteor.users.find({ _id: { $ne: User._id } }).fetch();

  return {
    isDataReady,
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
  setDisplayName('SendNoteContentContainer'),
  connect(mapStateToProps),
  withRouter,
  withStyles(styles),
  withTracker(trackHandler),
  withDataReadyHandler({ loose: true }),
)(SendNoteContent);
