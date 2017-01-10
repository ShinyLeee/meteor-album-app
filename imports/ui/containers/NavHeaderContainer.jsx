import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen } from '../redux/actions/creators.js';
import NavHeader from '../components/NavHeader/NavHeader.jsx';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NavHeader);
