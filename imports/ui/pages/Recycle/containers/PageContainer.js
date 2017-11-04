import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  disableSelectAll,
  snackBarOpen,
} from '/imports/ui/redux/actions';
import RecyclePage from '../Recycle';

const mapStateToProps = (state) => ({
  selectImages: state.selectCounter.selectImages,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  disableSelectAll,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RecyclePage);
