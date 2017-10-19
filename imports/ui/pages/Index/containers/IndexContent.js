import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import { Images } from '/imports/api/images/image';
import withRedirect from '/imports/ui/hocs/withRedirect';
import { snackBarOpen } from '/imports/ui/redux/actions';

import IndexPage from '../components/IndexContent';

const mapStateToProps = ({ portals }) => ({
  zoomerOpen: portals.zoomer.open,
  zoomerImage: portals.zoomer.image,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(() => {
    // Define How many pictures render in the first time
    const limit = 5;

    const userHandler = Meteor.subscribe('Users.all');
    const imageHandler = Meteor.subscribe('Images.all');
    const dataIsReady = userHandler.ready() && imageHandler.ready();

    const initialImages = Images.find(
      { private: false },
      { sort: { createdAt: -1 }, limit },
    ).fetch();

    return {
      limit,
      dataIsReady,
      initialImages,
    };
  }),
  withRouter,
  withRedirect,
)(IndexPage);
