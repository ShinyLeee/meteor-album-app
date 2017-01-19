import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { snackBarOpen, uploaderStop } from '/imports/ui/redux/actions/index.js';
import Uploader from './Uploader.jsx';

const mapStateToProps = (state) => {
  const uploader = state.uploader;
  if (uploader) {
    return {
      open: uploader.open,
      token: uploader.uptoken,
      destination: uploader.key,
    };
  }
  return { open: false };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  uploaderStop,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
