import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { setDisplayName } from 'recompose';
import { withStyles } from 'material-ui/styles';

import { snackBarOpen } from '/imports/ui/redux/actions';
import SettingEmailsContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const styles = {
  btn__add: {
    backgroundColor: '#fff',
  },
};

export default compose(
  setDisplayName('SettingEmailsContentContainer'),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(SettingEmailsContent);
