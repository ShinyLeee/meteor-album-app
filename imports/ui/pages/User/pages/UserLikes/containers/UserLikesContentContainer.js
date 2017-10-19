import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Images } from '/imports/api/images/image';

import { snackBarOpen } from '/imports/ui/redux/actions';
import UserLikesPage from '../components/UserLikesContent';

const mapStateToProps = ({ portals }) => ({
  zoomerOpen: portals.zoomer.open,
  zoomerImage: portals.zoomer.image,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ match }) => {
    // Define How many pictures render in the first time
    const limit = 5;

    const { username } = match.params;
    const imageHandler = Meteor.subscribe('Images.liked', username);
    const dataIsReady = imageHandler.ready();

    const initUserLikedImages = Images.find(
      { private: false, liker: { $in: [username] } },
      { sort: { createdAt: -1 }, limit },
    ).fetch();

    return {
      limit,
      dataIsReady,
      initUserLikedImages,
    };
  }),
)(UserLikesPage);
