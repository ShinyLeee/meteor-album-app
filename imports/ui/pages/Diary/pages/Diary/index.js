import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Diarys } from '/imports/api/diarys/diary.js';

import { snackBarOpen } from '/imports/ui/redux/actions/index.js';
import DiaryPage from './Diary.jsx';

const MeteorContainer = createContainer(({ User, location }) => {
  const { username } = User;
  const { query } = location;

  let start;
  let end;

  if (Object.keys(query).length === 0) {
    start = new Date();
    start.setHours(0, 0, 0, 0);

    end = new Date();
    end.setHours(23, 59, 59, 999);
  }

  const diaryHandler = Meteor.subscribe('Diarys.own');
  const dataIsReady = diaryHandler.ready();

  const diarys = Diarys.find(
    {
      user: username,
      createdAt: { $gte: start, $lt: end },
    },
    { sort: { createdAt: -1 } }
  ).fetch();

  return {
    dataIsReady,
    diarys,
  };
}, DiaryPage);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({ snackBarOpen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);