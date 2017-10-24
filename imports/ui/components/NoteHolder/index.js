import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from 'material-ui/styles';

import NoteHolder from './NoteHolder';

const styles = theme => ({
  subheader: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  subheader__icon: {
    position: 'absolute',
    top: -24,
    right: 0,
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },

  subheader__icon_open: {
    transform: 'rotate(180deg)',
  },

  cardActions: {
    justifyContent: 'flex-end',
  },

  cardActions__btn: {
    color: '#999',
  },
});

const trackHandler = ({ note }) => ({
  sender: Meteor.users.findOne({ username: note.sender }),
});

export default compose(
  withTracker(trackHandler),
  withStyles(styles),
  withRouter,
)(NoteHolder);
