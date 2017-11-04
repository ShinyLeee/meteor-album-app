import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { snackBarOpen } from '/imports/ui/redux/actions';
import SendNotePage from '../index';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SendNotePage);
