import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Images } from '/imports/api/images/image';

import {
  modalOpen,
  modalClose,
  selectCounter,
  enableSelectAll,
  disableSelectAll,
  snackBarOpen,
} from '../../redux/actions';
import RecyclePage from './Recycle';

const mapStateToProps = (state) => ({
  User: state.sessions.User,
  selectImages: state.selectCounter.selectImages,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  selectCounter,
  enableSelectAll,
  disableSelectAll,
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(() => {
    const imageHandle = Meteor.subscribe('Images.recycle');
    const dataIsReady = imageHandle.ready();
    const images = Images.find(
      { deletedAt: { $ne: null } },
      { sort: { shootAt: -1 } },
    ).fetch();
    return {
      dataIsReady,
      images,
    };
  }),
)(RecyclePage);
