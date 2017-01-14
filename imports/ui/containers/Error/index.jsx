import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Notes } from '/imports/api/notes/note.js';

import { snackBarOpen } from '../../redux/actions/index.js';

const errorHOC = wrappedComponent => {
  const MeteorContainer = createContainer(() => {
    Meteor.subscribe('Notes.own');
    const noteNum = Notes.find({ isRead: { $ne: true } }).count();
    return {
      noteNum,
    };
  }, wrappedComponent);

  const mapStateToProps = (state) => state;

  const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

  return connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
};

export default errorHOC;
