import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  disableSelectAll,
  modalOpen,
  modalClose,
  snackBarOpen,
} from '/imports/ui/redux/actions';
import RecyclePage from '../Recycle';

const mapStateToProps = (state) => ({
  selectImages: state.selectCounter.selectImages,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  disableSelectAll,
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RecyclePage);
