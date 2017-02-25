import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';
import {
  disableSelectAll,
  snackBarOpen,
  uploaderStart,
} from '/imports/ui/redux/actions/index.js';
import CollectionPage from './Collection.jsx';

const MeteorContainer = createContainer(({ params }) => {
  const { username, cname } = params;

  const User = Meteor.user();
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
  const curColl = Collections.findOne({ name: cname });
  const collExists = dataIsReady && !!curColl;
  // otherColls use for shift photos
  const otherColls = Collections.find(
    { name: { $ne: cname } },
    { fields: { name: 1, private: 1 } }
  ).fetch();

  return {
    dataIsReady,
    isGuest,
    curColl: curColl || {},
    otherColls,
    images: collExists ? curColl.images().fetch() : [],
  };
}, CollectionPage);

const mapStateToProps = (state) => ({
  uptoken: state.uptoken,
  counter: state.selectCounter.counter,
  selectImages: state.selectCounter.selectImages,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  disableSelectAll,
  snackBarOpen,
  uploaderStart,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
