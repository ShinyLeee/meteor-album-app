import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import { Images } from '/imports/api/images/image';
import { Comments } from '/imports/api/comments/comment';
import { snackBarOpen } from '/imports/ui/redux/actions';

import ImageHolder from './ImageHolder';

const styles = {
  btn: {
    color: 'rgba(0, 0, 0, 0.87)',
  },

  btn__heart: {
    color: '#f15151',
  },

  icon: {
    margin: 'auto',
  },
};

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const trackHandler = ({ User, image }) => {
  // discussion_id from comment
  const imageId = image._id;

  Meteor.subscribe('Images.specific', imageId);
  Meteor.subscribe('Comments.inImage', imageId);

  let owner;
  if (User && User.username === image.user) {
    owner = User;
  } else {
    Meteor.subscribe('Users.all');
    owner = Meteor.users.findOne({ username: image.user }) || {};
  }

  const freshImage = Images.findOne(imageId);

  const commentsNum = Comments.find({ discussion_id: imageId, type: 'image' }).count();
  return {
    owner,
    image: freshImage,
    commentsNum,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackHandler),
  withStyles(styles),
  withRouter,
)(ImageHolder);

