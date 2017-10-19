import queryString from 'query-string';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import SendNoteContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

const trackHandler = ({ User, location }) => {
  const { receiver } = queryString.parse(location.search);
  const userHandler = Meteor.subscribe('Users.all');
  const dataIsReady = userHandler.ready();

  const initReceiver = receiver && Meteor.users.findOne({ username: receiver });

  const otherUsers = Meteor.users.find({ _id: { $ne: User._id } }).fetch();

  return {
    dataIsReady,
    initReceiver,
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
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackHandler),
  withStyles(styles),
)(SendNoteContent);
