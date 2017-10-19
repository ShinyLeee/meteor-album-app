import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import SettingContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
  token: sessions.uptoken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

const styles = {
  btn__camera: {
    alignSelf: 'flex-start',
    width: 38,
    height: 38,
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
  },

  icon__avatar: {
    width: 48,
    height: 48,
  },

  icon__camera: {
    height: '38px',
    color: '#fff',
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(SettingContent);
