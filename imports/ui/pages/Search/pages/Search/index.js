import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/imports/api/users/user.js';
import { Collections } from '/imports/api/collections/collection.js';

import SearchPage from './Search.jsx';

const MeteorContainer = createContainer(() => {
  const userHandler = Meteor.subscribe('Users.limit', 4);
  const collHandler = Meteor.subscribe('Collections.limit', 2);
  const dataIsReady = userHandler.ready() && collHandler.ready();

  const users = Users.find({}, { limit: 4 }).fetch();
  const collections = Collections.find({ private: false }, { limit: 2 }).fetch();

  return {
    dataIsReady,
    users,
    collections,
  };
}, SearchPage);

export default MeteorContainer;