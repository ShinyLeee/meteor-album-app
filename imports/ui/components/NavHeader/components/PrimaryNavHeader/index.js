import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import PrimaryNavHeader from './PrimaryNavHeader.jsx';

const MeteorContainer = createContainer(() => {
  Meteor.subscribe('Notes.receiver');
  const noteNum = Notes.find({ isRead: false }).count();

  return {
    noteNum,
  };
}, PrimaryNavHeader);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
