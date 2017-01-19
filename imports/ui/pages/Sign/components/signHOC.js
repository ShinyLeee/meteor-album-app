import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '/imports/ui/redux/actions/index';

const signHOC = wrappedComponent => {
  const mapStateToProps = (state) => state;
  const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

  return connect(mapStateToProps, mapDispatchToProps)(wrappedComponent);
};

export default signHOC;
