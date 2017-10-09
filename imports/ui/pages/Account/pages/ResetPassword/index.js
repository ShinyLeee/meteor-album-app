import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import ResetPassword from './ResetPassword';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default connect(null, mapDispatchToProps)(ResetPassword);
