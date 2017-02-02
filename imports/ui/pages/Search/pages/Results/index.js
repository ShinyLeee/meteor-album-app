import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Users } from '/imports/api/users/user.js';
import { Collections } from '/imports/api/collections/collection.js';

import ResultsPage from './Results.jsx';

const MeteorContainer = createContainer(({ params: { query } }) => {
  const userHandler = Meteor.subscribe('Users.all', 4);
  const collHandler = Meteor.subscribe('Collections.all', 2);
  const dataIsReady = userHandler.ready() && collHandler.ready();

  const regex = new RegExp(`^${query}`, 'i');

  const users = Users.find({ username: { $regex: regex } }).fetch();
  const collections = Collections.find({
    $or: [
      { user: { $regex: regex }, private: false },
      { name: { $regex: regex }, private: false },
    ],
  }).fetch();

  return {
    dataIsReady,
    users,
    collections,
  };
}, ResultsPage);

export default MeteorContainer;
