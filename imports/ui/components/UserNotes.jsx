import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';

import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';

import { Notes } from '../../api/notes/note.js';

class UserNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'UserNotes',
    };
  }

  renderNoteCard() {
    const filteredNotes = this.props.notes;
    const flipReplyStyle = {
      color: '#999',
      MozTransform: 'scaleX(-1)',
      WebkitTransform: 'scaleX(-1)',
      OTransform: 'scaleX(-1)',
      transform: 'scaleX(-1)',
    };
    const replyStyle = {
      position: 'absolute',
      right: '56px',
    };
    const checkboxStyle = {
      position: 'absolute',
      right: '4px',
    };
    return filteredNotes.map((note) => (
      <Card
        key={note._id}
        style={{ marginBottom: '30px' }}
        initiallyExpanded
      >
        <CardHeader
          title={note.title}
          subtitle={moment(note.sendAt).format('YYYY-MM-DD')}
          avatar={this.props.User.profile.avatar}
          actAsExpander
          showExpandableButton
        />
        <CardText expandable>
          <ReactMarkdown source={note.content} />
        </CardText>
        <CardActions style={{ height: '58px' }}>
          <IconButton
            tooltip="回复"
            tooltipPosition="top-center"
            iconStyle={flipReplyStyle}
            style={replyStyle}
            touch
          ><ReplyIcon />
          </IconButton>
          <IconButton
            tooltip="标记已读"
            tooltipPosition="top-center"
            iconStyle={{ color: '#999' }}
            style={checkboxStyle}
            touch
          ><CheckBoxIcon />
          </IconButton>
        </CardActions>
      </Card>
    ));
  }

  render() {
    if (!this.props.dataIsReady) {
      return (
        <div className="text-center">
          <CircularProgress size={1} />
        </div>
      );
    }
    return (
      <div className="user-content">
        {this.renderNoteCard()}
      </div>
    );
  }

}

UserNotes.propTypes = {
  dataIsReady: PropTypes.bool.isRequired,
  notes: PropTypes.array.isRequired,
  User: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const dataHandle = Meteor.subscribe('Notes.ownNotes');
  const dataIsReady = dataHandle.ready();
  const notes = Notes.find({}, { sort: { createdAt: -1 } }).fetch();
  return {
    dataIsReady,
    notes,
  };
}, UserNotes);
