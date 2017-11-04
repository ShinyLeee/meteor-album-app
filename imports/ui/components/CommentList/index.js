import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';
import { Comments } from '/imports/api/comments/comment';
import { snackBarOpen } from '/imports/ui/redux/actions';

import CommentList from './CommentList';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const styles = {
  input: {
    alignSelf: 'flex-end',
    paddingLeft: 16,
  },

  list: {
    borderTop: '1px solid #ebebeb',
  },
};

const trackHandler = ({ open, discId }) => {
  // discussion_id from comment
  let comments = [];
  if (open) {
    Meteor.subscribe('Comments.inImage', discId);
    comments = Comments.find(
      { discussion_id: discId, type: 'image' },
      { sort: { createdAt: -1 } },
    ).fetch();
  }

  return {
    comments,
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withTracker(trackHandler),
  withRouter,
)(CommentList);
