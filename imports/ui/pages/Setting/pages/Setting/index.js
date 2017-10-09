import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import SettingPage from './Setting';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
  token: sessions.uptoken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SettingPage);
