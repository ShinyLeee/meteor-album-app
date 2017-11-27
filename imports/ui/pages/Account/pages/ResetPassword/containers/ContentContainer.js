import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { withStyles } from 'material-ui/styles';

import { snackBarOpen } from '/imports/ui/redux/actions';
import ResetPasswordContent from '../components/Content';

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
  setDisplayName('ResetPasswordContentContainer'),
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(ResetPasswordContent);
