import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Collections } from '/imports/api/collections/collection.js';

import {
  snackBarOpen,
  uploaderStart,
  selectCounter,
  selectGroupCounter,
  enableSelectAll,
  disableSelectAll,
} from '../../../redux/actions/index.js';
import CollectionPage from '../../../pages/Collection/pages/Collection/index.jsx';

const MeteorContainer = createContainer(({ params }) => {
  const { username, cname } = params;

  const User = Meteor.user();
  let isGuest = !User;  // if User is null, isGuest is true

  // if User exist and its name equal with params.username, isGuest is false
  if (User && User.username === username) isGuest = false;
  else isGuest = true;

  const collHandler = Meteor.subscribe('Collections.inUser', username);
  const imageHandler = Meteor.subscribe('Images.inCollection', { username, cname });
  const dataIsReady = collHandler.ready() && imageHandler.ready();

  // curColl is currentCollection use for lock/remove etc.
  const curColl = Collections.findOne({ name: cname }) || {};
  const collExists = dataIsReady && !!curColl;
  // otherColls use for shift photos
  const otherColls = Collections.find(
    { name: { $ne: cname } },
    { fields: { name: 1 } }
  ).fetch();

  return {
    dataIsReady,
    isGuest,
    curColl,
    otherColls,
    images: collExists ? curColl.images().fetch() : [],
  };
}, CollectionPage);

const mapStateToProps = (state) => ({
  uptoken: state.uptoken,
  selectImages: state.selectCounter.selectImages,
  group: state.selectCounter.group,
  counter: state.selectCounter.counter,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  snackBarOpen,
  uploaderStart,
  selectCounter,
  selectGroupCounter,
  enableSelectAll,
  disableSelectAll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
