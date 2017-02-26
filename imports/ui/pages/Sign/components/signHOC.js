import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '/imports/ui/redux/actions/index';

const signHOC = wrappedComponent => {
  const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

  return connect(null, mapDispatchToProps)(wrappedComponent);
};

export default signHOC;
