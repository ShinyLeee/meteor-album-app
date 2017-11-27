import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setDisplayName } from 'recompose';
import { Images } from '/imports/api/images/image';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
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

const trackerHandler = () => {
  const imageHandle = Meteor.subscribe('Images.recycle');
  const isDataReady = imageHandle.ready();
  const images = Images.find(
    { deletedAt: { $ne: null } },
    { sort: { shootAt: -1 } },
  ).fetch();
  return {
    isDataReady,
    images,
  };
};

export default compose(
  setDisplayName('RecycleContentContainer'),
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackerHandler),
  withDataReadyHandler(),
)(Content);
