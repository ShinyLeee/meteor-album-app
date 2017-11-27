import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import setDisplayName from 'recompose/setDisplayName';
import { withStyles } from 'material-ui/styles';
import { Collections } from '/imports/api/collections/collection';
import { snackBarOpen } from '/imports/ui/redux/actions';
import OwnView from '../components/OwnView';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
}, dispatch);

const trackHandler = ({ User, match }) => {
  const { username: curUserName } = match.params;

  const isOwner = !!User && (User.username === curUserName);

  const userHandler = Meteor.subscribe('Users.all');
  const collHandler = isOwner
    ? Meteor.subscribe('Collections.own')
    : Meteor.subscribe('Collections.inUser', curUserName);

  const dataIsReady = userHandler.ready() && collHandler.ready();

  const curUser = Meteor.users.findOne({ username: curUserName });

  const collSelector = isOwner ? { user: curUserName } : { user: curUserName, private: false };

  const colls = Collections.find(
    collSelector,
    { sort: { createdAt: -1 } },
  ).fetch();

  const existCollNames = isOwner
    ? Collections.find({ user: User.username }, { fields: { name: 1 } }).map(coll => coll.name)
    : [];

  return {
    dataIsReady,
    isOwner,
    curUser,
    colls,
    existCollNames,
  };
};

const styles = {
  paper: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(50% - 2px)',
    maxWidth: 225,
    marginTop: 4,
    verticalAlign: 'top',
    cursor: 'pointer',
  },

  icon: {
    width: 48,
    height: 48,
    color: '#676767',
  },

  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#676767',
  },
};

export default compose(
  setDisplayName('DynamicOwnViewContainer'),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackHandler),
  withStyles(styles),
)(OwnView);
