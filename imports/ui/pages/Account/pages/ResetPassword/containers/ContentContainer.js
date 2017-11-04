import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

import { snackBarOpen } from '/imports/ui/redux/actions';
import ResetPasswordPage from '../index';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);


const styles = {
  input: {
    display: 'flex',
    alignItems: 'flex-end',
    height: 48,
    paddingLeft: 14,
    borderBottom: '1px solid #e0e0e0',
  },
};

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(ResetPasswordPage);
