import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { withStyles } from 'material-ui/styles';
import { userLogin, snackBarOpen } from '/imports/ui/redux/actions';
import RegisterContent from '../components/Content';

const styles = theme => ({
  input: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'solid 1px #e0e0e0',
    padding: '0 6px',
  },

  btn__register: {
    width: '100%',
    color: '#fff',
    backgroundImage: theme.palette.gradients.plumPlate,
    '&:hover': {
      opacity: 0.9,
    },
  },

  btn__login: {
    width: '100%',
    color: '#fff',
    backgroundImage: theme.palette.gradients.aboveCloud,
    '&:hover': {
      opacity: 0.9,
    },
  },
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogin,
  snackBarOpen,
}, dispatch);

export default compose(
  setDisplayName('RegisterContentContainer'),
  connect(null, mapDispatchToProps),
  withStyles(styles),
  withRouter,
)(RegisterContent);
