import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';

import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';

import { Notes } from '../../api/notes/note.js';

class UserNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorModal: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick(e) {
    e.preventDefault();
    const href = e.target.href;
    const title = e.target.text;
    // User jQuery because Fetch API did not support JSONP
    $.ajax({
      url: href,
      dataType: 'jsonp',
      json: 'getBible',
      cache: true,
      beforeSend: () => {
        this.setState({
          anchorModal: true,
          bibleIsReady: false,
        });
      },
      success: (data) => {
        this.setState({
          bibleName: title,
          bibleChap: data.book[0].chapter,
          bibleIsReady: true,
        });
      },
    });
  }

  handleClose() {
    this.setState({
      anchorModal: false,
    });
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
          <div className="markdown-holder">
            <ReactMarkdown
              className="markdown"
              source={note.content}
              onLinkClick={this.handleLinkClick}
            />
          </div>
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

  renderModalContent() {
    if (!this.state.bibleIsReady) {
      return (
        <Dialog
          modal={false}
          open={this.state.anchorModal}
          onRequestClose={this.handleClose}
        >
          <div className="text-center">
            <CircularProgress size={0.6} />
          </div>
        </Dialog>
      );
    }
    const chapters = _.map(this.state.bibleChap, (chap) =>
      `<small>${chap.verse_nr}</small> ${chap.verse}`
      );
    return (
      <Dialog
        title={this.state.bibleName}
        modal={false}
        open={this.state.anchorModal}
        onRequestClose={this.handleClose}
        bodyStyle={{ padding: '10px 24px 24px' }}
        autoScrollBodyContent
      >
        <div dangerouslySetInnerHTML={{ __html: chapters }} />
      </Dialog>
    );
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
        {this.renderModalContent()}
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
