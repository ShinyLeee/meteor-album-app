import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import { Collections } from '/imports/api/collections/collection';
import { Images } from '/imports/api/images/image';

import { userLogout, snackBarOpen } from '/imports/ui/redux/actions';
import UserContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogout,
  snackBarOpen,
}, dispatch);

const trackerHandler = ({ match }) => {
  const { username } = match.params;

  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = Meteor.subscribe('Images.all');
  const collHandler = Meteor.subscribe('Collections.inUser', username);

  const counts = {
    likes: 0,
    colls: 0,
    followers: 0,
  };
  let dataIsReady = false;
  let topImages = [];

  const userIsReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username }) || {};

  if (userIsReady) {
    dataIsReady = imageHandler.ready() && collHandler.ready();
    counts.likes = Images.find({ liker: { $in: [curUser.username] } }).count();
    counts.colls = Collections.find().count();
    counts.followers = curUser.profile.followers.length;
    topImages = Images.find(
      { user: curUser.username },
      { limit: 10 })
      .fetch()
      .sort((p, n) => n.liker.length - p.liker.length);
  }

  return {
    dataIsReady,
    curUser,
    counts,
    topImages,
  };
};

const styles = {
  btn__left: {
    marginRight: 20,
  },

  btn__more: {
    backgroundColor: '#fff',
  },
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackerHandler),
  withStyles(styles),
)(UserContent);
