import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { storeUptoken, clearUptoken } from '../redux/actions/creators.js';
import App from '../App.jsx';

const MeteorContainer = createContainer(() => {
  let userIsReady;
  const User = Meteor.user();
  if (typeof User === 'undefined' || User) userIsReady = !!User;
  else userIsReady = true;
  return {
    User,
    userIsReady,
  };
}, App);

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  storeUptoken,
  clearUptoken,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MeteorContainer);
