import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Diarys } from '/imports/api/diarys/diary.js';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import EditDiaryPage from './Edit.jsx';

const MeteorContainer = createContainer(({ params }) => {
  const { diaryId } = params;

  const diaryHandler = Meteor.subscribe('Diarys.own');
  const dataIsReady = diaryHandler.ready();

  const initialDiary = Diarys.findOne(diaryId);

  return {
    dataIsReady,
    initialDiary,
  };
}, EditDiaryPage);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
