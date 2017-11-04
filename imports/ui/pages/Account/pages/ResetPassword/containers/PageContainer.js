import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

import { snackBarOpen } from '/imports/ui/redux/actions';
import ResetPasswordPage from '../index';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);


const styles = {
  navheader__root: {
    backgroundColor: blue[500],
  },

  navheader__content: {
    color: '#fff',
  },
};

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles),
)(ResetPasswordPage);
