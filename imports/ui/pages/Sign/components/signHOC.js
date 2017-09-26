import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { userLogin, snackBarOpen } from '/imports/ui/redux/actions';

const signHOC = wrappedComponent => {
  const mapDispatchToProps = (dispatch) => bindActionCreators({
    userLogin,
    snackBarOpen,
  }, dispatch);

  return connect(null, mapDispatchToProps)(wrappedComponent);
};

export default signHOC;
