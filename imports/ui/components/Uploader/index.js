import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  storeUptoken,
  clearUptoken,
  snackBarOpen,
  uploaderStop,
} from '/imports/ui/redux/actions';
import Uploader from './Uploader';

const mapStateToProps = ({ sessions, portals }) => ({
  User: sessions.User,
  token: sessions.uptoken,
  open: portals.uploader.open,
  destination: portals.uploader.destination,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  storeUptoken,
  clearUptoken,
  snackBarOpen,
  uploaderStop,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
