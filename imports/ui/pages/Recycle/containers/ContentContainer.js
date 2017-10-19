import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Images } from '/imports/api/images/image';

import {
  enableSelectAll,
  disableSelectAll,
} from '/imports/ui/redux/actions';
import Content from '../components/Content';

const mapStateToProps = (state) => ({
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  enableSelectAll,
  disableSelectAll,
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
)(Content);
