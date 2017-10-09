import queryString from 'query-string';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import SendNotePage from './SendNote';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ User, location }) => {
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
  }),
)(SendNotePage);
