import map from 'lodash/map';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setDisplayName } from 'recompose';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Notes } from '/imports/api/notes/note';
import CardLoader from '/imports/ui/components/Loader/CardLoader';
import withDataReadyHandler from '/imports/ui/hocs/withDataReadyHandler';
import AllNotesContent from '../components/Content';

const mapStateToProps = ({ sessions }) => ({
  User: sessions.User,
});

const trackHandler = ({ User }) => {
  // Define How many notes render in the first time
  const limit = 5;

  const userHandler = Meteor.subscribe('Users.others');
  const noteHandler = Meteor.subscribe('Notes.receiver');
  const isDataReady = userHandler.ready() && noteHandler.ready();

  const notes = Notes.find(
    { receiver: User.username },
    { sort: { sendAt: -1 }, limit },
  ).fetch();

  const notesNum = Notes.find({ receiver: User.username }).count();

  return {
    isDataReady,
    limit,
    notes,
    notesNum,
  };
};

const dataHandlerOps = {
  placeholder: map(
    [1, 2, 3],
    (key) => <CardLoader key={key} />,
  ),
};

export default compose(
  setDisplayName('AllNotesContentContainer'),
  connect(mapStateToProps),
  withTracker(trackHandler),
  withDataReadyHandler(dataHandlerOps),
)(AllNotesContent);
