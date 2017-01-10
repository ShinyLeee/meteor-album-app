import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '../redux/actions/creators.js';
import SettingPage from '../pages/Setting/Setting.jsx';

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('Notes.own');
  const noteNum = Notes.find({ isRead: { $ne: true } }).count();

  return {
    noteNum,
  };
}, SettingPage);

const mapStateToProps = (state) => ({
  uptoken: state.uptoken,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
