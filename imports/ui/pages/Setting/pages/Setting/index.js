import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import SettingPage from './Setting.jsx';

const mapStateToProps = (state) => ({
  User: state.User,
  token: state.uptoken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SettingPage);
