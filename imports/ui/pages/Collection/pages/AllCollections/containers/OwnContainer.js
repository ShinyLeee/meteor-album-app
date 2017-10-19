import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { Collections } from '/imports/api/collections/collection';
import { modalOpen, modalClose, snackBarOpen } from '/imports/ui/redux/actions';
import OwnView from '../components/OwnView';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  modalOpen,
  modalClose,
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

  let colls;
  const curUser = Meteor.users.findOne({ username: curUserName });

  if (isOwner) {
    colls = Collections.find({ user: curUserName }, { sort: { createdAt: -1 } }).fetch();
  } else {
    colls = Collections.find({ user: curUserName, private: false }, { sort: { createdAt: -1 } }).fetch();
  }

  return {
    dataIsReady,
    isOwner,
    curUser,
    colls,
    existCollNames: Collections.find({ user: User.username }, { fields: { name: 1 } }).map(coll => coll.name),
  };
};

const styles = {
  paper: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'calc(50% - 2px)',
    maxWidth: 200,
    height: 245,
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
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(trackHandler),
  withStyles(styles),
)(OwnView);
