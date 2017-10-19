import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import SettingEmailsContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

const styles = {
  btn__add: {
    backgroundColor: '#fff',
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(SettingEmailsContent);
