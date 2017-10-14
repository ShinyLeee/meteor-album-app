import moment from 'moment';
import queryString from 'query-string';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Diarys } from '/imports/api/diarys/diary';

import { diaryOpen, snackBarOpen } from '/imports/ui/redux/actions';
import DiaryPage from './Diary';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  diaryOpen,
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ User, location }) => {
    const query = queryString.parse(location.search);

    let start;
    let end;

    if (Object.keys(query).length === 0) {
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
    } else {
      const date = moment(`${query.year}-${query.month || 1}`, 'YYYY-MM');
      start = date.startOf('month').toDate();
      end = date.endOf('month').toDate();
    }

    const diaryHandler = Meteor.subscribe('Diarys.own');
    const dataIsReady = !!User && diaryHandler.ready();

    let diarys = [];

    if (User) {
      diarys = Diarys.find(
        {
          user: User.username,
          createdAt: { $gte: start, $lt: end },
        },
        { sort: { createdAt: -1 } },
      ).fetch();
    }

    return {
      dataIsReady,
      diarys,
      date: start,
    };
  }),
)(DiaryPage);
