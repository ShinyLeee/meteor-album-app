import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';
import settings from '/imports/utils/settings';
import { snackBarOpen } from '/imports/ui/redux/actions';
import AllCollectionsPage from './AllCollections';

const { preCurUser } = settings;

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ User, match }) => {
    const { username } = match.params;

    let isGuest = !User;  // if User is null, isGuest is true
    // if User exist and its name equal with params.username, isGuest is false
    if (User && User.username === username) isGuest = false;
    else isGuest = true;

    const userHandler = Meteor.subscribe('Users.all');
    const collHandler = isGuest
    ? Meteor.subscribe('Collections.inUser', username) && Meteor.subscribe('Collections.inUserFollowing', username)
    : Meteor.subscribe('Collections.own') && Meteor.subscribe('Collections.ownFollowing');

    const dataIsReady = userHandler.ready() && collHandler.ready();

    let colls;
    let existCollNames;
    const curUser = Meteor.users.findOne({ username }) || preCurUser;

    if (!isGuest) {
      colls = Collections.find({}, { sort: { createdAt: -1 } }).fetch();
      existCollNames = Collections.find({ user: User.username }, { fields: { name: 1 } }).map(coll => coll.name);
    } else {
      colls = Collections.find({ private: false }, { sort: { createdAt: -1 } }).fetch();
    }

    return {
      dataIsReady,
      isGuest,
      curUser,
      colls,
      existCollNames,
    };
  }),
)(AllCollectionsPage);
