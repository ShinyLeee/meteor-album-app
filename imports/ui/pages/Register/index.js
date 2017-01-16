import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '../../redux/actions/index.js';
import RegisterPage from './Register.jsx';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
