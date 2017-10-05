import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Images } from '/imports/api/images/image.js';
import withRedirect from '/imports/ui/hocs/withRedirect';
import { snackBarOpen } from '/imports/ui/redux/actions';

import IndexPage from './IndexPage';

const IndexContainer = createContainer(() => {
  // Define How many pictures render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.all');
  const imageHandler = Meteor.subscribe('Images.all');
  const dataIsReady = userHandler.ready() && imageHandler.ready();

  const initialImages = Images.find(
    { private: false },
    { sort: { createdAt: -1 }, limit }
  ).fetch();

  return {
    limit,
    dataIsReady,
    initialImages,
  };
}, IndexPage);

const mapStateToProps = (state) => ({
  zoomerOpen: state.zoomer.open,
  zoomerImage: state.zoomer.image,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRedirect,
)(IndexContainer);
