import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  storeUptoken,
  clearUptoken,
  snackBarOpen,
  uploaderStop,
} from '/imports/ui/redux/actions';
import Uploader from './Uploader.jsx';

const mapStateToProps = (state) => ({
  User: state.User,
  token: state.uptoken,
  open: state.uploader.open,
  destination: state.uploader.destination,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  storeUptoken,
  clearUptoken,
  snackBarOpen,
  uploaderStop,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
