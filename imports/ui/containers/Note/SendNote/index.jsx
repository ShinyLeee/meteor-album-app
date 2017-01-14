import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '../../../redux/actions/index.js';
import SendNotePage from '../../../pages/Note/pages/SendNote/index.jsx';

const MeteorContainer = createContainer(({ location }) => {
  const { receiver } = location.query;
  const userHandler = Meteor.subscribe('Users.all');
  const userIsReady = userHandler.ready();

  const uid = Meteor.userId();
  const initialReceiver = receiver && Meteor.users.findOne({ username: receiver });
  const otherUsers = Meteor.users.find({ _id: { $ne: uid } }).fetch();

  return {
    userIsReady,
    initialReceiver,
    otherUsers,
  };
}, SendNotePage);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
