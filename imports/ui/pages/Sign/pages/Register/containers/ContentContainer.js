import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import grey from 'material-ui/colors/grey';
import { userLogin, modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import RegisterContent from '../components/Content';

const styles = {
  input: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'solid 1px #e0e0e0',
    padding: '0 6px',
  },

  btn__register: {
    width: '100%',
    color: '#fff',
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[400],
    },
  },

  btn__login: {
    width: '100%',
    color: '#fff',
    backgroundColor: grey[500],
    '&:hover': {
      backgroundColor: grey[400],
    },
  },
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(RegisterContent);
