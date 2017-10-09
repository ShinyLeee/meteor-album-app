import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import WriteDiaryPage from './Write';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WriteDiaryPage);
