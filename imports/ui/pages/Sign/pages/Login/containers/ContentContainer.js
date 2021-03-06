import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { withStyles } from 'material-ui/styles';
import { userLogin, snackBarOpen } from '/imports/ui/redux/actions';
import LoginContent from '../components/Content';

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  snackBarOpen,
}, dispatch);

const styles = theme => ({
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
    backgroundImage: theme.palette.gradients.plumPlate,
    '&:hover': {
      opacity: 0.9,
    },
  },

  btn__register: {
    width: '100%',
    color: '#fff',
    backgroundImage: theme.palette.gradients.aboveCloud,
    '&:hover': {
      opacity: 0.9,
    },
  },
});

export default compose(
  setDisplayName('LoginContentContainer'),
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(LoginContent);
