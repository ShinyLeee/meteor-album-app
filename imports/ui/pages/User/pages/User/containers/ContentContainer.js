import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import { Collections } from '/imports/api/collections/collection';
import { Images } from '/imports/api/images/image';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import { userLogout, snackBarOpen } from '/imports/ui/redux/actions';
import UserContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  isLoggedIn: sessions.isLoggedIn,
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogout,
  snackBarOpen,
}, dispatch);

const trackerHandler = ({ isOwner, match }) => {
  const { username } = match.params;

  const userHandler = Meteor.subscribe('Users.all');
  const likedHandler = Meteor.subscribe('Images.liked', username);
  const collHandler = isOwner
    ? Meteor.subscribe('Collections.own')
    : Meteor.subscribe('Collections.inUser', username);
  const imageHandler = isOwner
    ? Meteor.subscribe('Images.own')
    : Meteor.subscribe('Images.inUser', username);

  const counts = {
    likes: 0,
    colls: 0,
    followers: 0,
  };
  let isDataReady = false;
  let topImages = [];

  const userIsReady = userHandler.ready();
  const curUser = Meteor.users.findOne({ username });

  if (userIsReady) {
    const likesSelector = { liker: { $in: [curUser.username] } };
    const collSelector = {};
    const imgsSelctor = { user: curUser.username };
    if (!isOwner) {
      likesSelector.private = false;
      collSelector.private = false;
      imgsSelctor.private = false;
    }
    isDataReady = likedHandler.ready() && collHandler.ready() && imageHandler.ready();
    counts.likes = Images.find(likesSelector).count();
    counts.colls = Collections.find(collSelector).count();
    counts.followers = curUser.profile.followers.length;
    topImages = Images.find(imgsSelctor, { limit: 10 })
      .fetch()
      .sort((p, n) => n.liker.length - p.liker.length);
  }

  return {
    isDataReady,
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
  setDisplayName('UserContentContainer'),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackerHandler),
  withStyles(styles),
  withDataReadyHandler(),
)(UserContent);
