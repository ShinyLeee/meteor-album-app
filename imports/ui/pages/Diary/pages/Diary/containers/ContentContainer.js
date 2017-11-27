import moment from 'moment';
import queryString from 'query-string';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Diarys } from '/imports/api/diarys/diary';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import { diaryOpen, snackBarOpen } from '/imports/ui/redux/actions';
import DiaryPage from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  isLoggedIn: sessions.isLoggedIn,
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  diaryOpen,
  snackBarOpen,
}, dispatch);

const trackHandler = ({ isLoggedIn, User, location }) => {
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
  const isDataReady = isLoggedIn && diaryHandler.ready();

  const diarys = isDataReady
    ? Diarys.find({
      user: User.username,
      createdAt: { $gte: start, $lt: end },
    }, { sort: { createdAt: -1 } },
    ).fetch()
    : [];

  return {
    isDataReady,
    diarys,
    date: start,
  };
};

export default compose(
  setDisplayName('DiaryContentContainer'),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackHandler),
  withDataReadyHandler(),
)(DiaryPage);
