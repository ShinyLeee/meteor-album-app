import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Users } from '/imports/api/users/user';
import { Collections } from '/imports/api/collections/collection';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import SearchContent from '../components/Content';

const trackHandler = () => {
  const userHandler = Meteor.subscribe('Users.limit', 4);
  const collHandler = Meteor.subscribe('Collections.limit', 2);
  const isDataReady = userHandler.ready() && collHandler.ready();

  const users = Users.find({}, { limit: 4 }).fetch();
  const collections = Collections.find({ private: false }, { limit: 2 }).fetch();

  return {
    isDataReady,
    users,
    collections,
  };
};

export default compose(
  setDisplayName('SearchContentContainer'),
  withRouter,
  withTracker(trackHandler),
  withDataReadyHandler(),
)(SearchContent);
