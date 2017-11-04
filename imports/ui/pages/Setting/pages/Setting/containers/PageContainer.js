import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

import { snackBarOpen } from '/imports/ui/redux/actions';
import SettingPage from '../index';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
  token: sessions.uptoken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const styles = {
  icon__camera: {
    height: '38px',
    color: '#fff',
  },

  navheader__root: {
    backgroundColor: blue[500],
  },

  navheader__content: {
    color: '#fff',
  },
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(SettingPage);
