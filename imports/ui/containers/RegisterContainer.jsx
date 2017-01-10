import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '../redux/actions/creators.js';
import RegisterPage from '../pages/Register/Register.jsx';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
