import queryString from 'query-string';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '/imports/ui/redux/actions';
import SendNotePage from './SendNote';

const MeteorContainer = createContainer(({ User, location }) => {
  const { receiver } = queryString.parse(location.search);
  const userHandler = Meteor.subscribe('Users.all');
  const dataIsReady = userHandler.ready();

  const initialReceiver = receiver && Meteor.users.findOne({ username: receiver });

  const otherUsers = Meteor.users.find({ _id: { $ne: User._id } }).fetch() || [];

  return {
    dataIsReady,
    initialReceiver,
    otherUsers,
  };
}, SendNotePage);

const mapStateToProps = (state) => ({
  User: state.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
