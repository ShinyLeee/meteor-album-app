import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';
import {
  disableSelectAll,
  modalOpen,
  modalClose,
  snackBarOpen,
  uploaderStart,
} from '/imports/ui/redux/actions';
import CollectionPage from './Collection';

const mapStateToProps = ({ sessions, selectCounter }) => ({
  User: sessions.User,
  counter: selectCounter.counter,
  selectImages: selectCounter.selectImages,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  disableSelectAll,
  modalOpen,
  modalClose,
  snackBarOpen,
  uploaderStart,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTracker(({ User, match }) => {
    const { username, cname } = match.params;

    let isGuest = !User;  // if User is null, isGuest is true

    // if User exist and its name equal with params.username, isGuest is false
    if (User && User.username === username) isGuest = false;
    else isGuest = true;

    const collHandler = isGuest
                        ? Meteor.subscribe('Collections.inUser', username)
                        : Meteor.subscribe('Collections.own');
    const imageHandler = Meteor.subscribe('Images.inCollection', { username, cname });
    const dataIsReady = collHandler.ready() && imageHandler.ready();

    // curColl is currentCollection use for lock/remove etc.
    const curColl = Collections.findOne({ name: cname }) || {};
    const collExists = dataIsReady && !!curColl;
    // otherColls use for shift photos
    const otherColls = Collections.find(
      { name: { $ne: cname } },
      { fields: { name: 1, private: 1 } }
    ).fetch();

    return {
      dataIsReady,
      isGuest,
      curColl,
      otherColls,
      images: collExists ? curColl.images().fetch() : [],
    };
  }),
)(CollectionPage);
