import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import { userLogout, snackBarOpen } from '/imports/ui/redux/actions';
import SettingPasswordContent from '../components/Content';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogout,
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
)(SettingPasswordContent);
