import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import purple from 'material-ui/colors/purple';
import grey from 'material-ui/colors/grey';
import { userLogin, snackBarOpen } from '/imports/ui/redux/actions';
import withRedirect from '/imports/ui/hocs/withRedirect';
import LoginContent from '../components/Content';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  snackBarOpen,
}, dispatch);

const styles = {
  input: {
    display: 'flex',
    alignItems: 'flex-end',
    height: 48,
    borderBottom: 'solid 1px #e0e0e0',
    padding: '0 6px',
  },

  btn__login: {
    width: '100%',
    color: '#fff',
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[400],
    },
  },

  btn__register: {
    width: '100%',
    color: '#fff',
    backgroundColor: grey[500],
    '&:hover': {
      backgroundColor: grey[400],
    },
  },
};

export default compose(
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRouter,
  withRedirect,
)(LoginContent);
