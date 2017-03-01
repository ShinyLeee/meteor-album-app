import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  clearUptoken,
  storeUptoken,
  snackBarOpen,
  uploaderStop,
} from '/imports/ui/redux/actions/index.js';
import Uploader from './Uploader.jsx';

const mapStateToProps = (state) => ({
  token: state.uptoken,
  open: state.uploader.open,
  destination: state.uploader.destination,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  clearUptoken,
  storeUptoken,
  snackBarOpen,
  uploaderStop,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
