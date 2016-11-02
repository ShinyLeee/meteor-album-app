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
        const bibleChap = data.chapter || data.book[0].chapter;
        this.setState({
          bibleName: title,
          bibleChap,
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
    const { registerUsers, notes } = this.props;
    if (notes.length === 0) {
      return (
        <div className="text-center">
          暂未收到卡片
        </div>
      );
    }
    const styles = {
      flipReplyStyle: {
        color: '#999',
        MozTransform: 'scaleX(-1)',
        WebkitTransform: 'scaleX(-1)',
        OTransform: 'scaleX(-1)',
        transform: 'scaleX(-1)',
      },
      replyStyle: {
        position: 'absolute',
        right: '56px',
      },
      checkboxStyle: {
        position: 'absolute',
        right: '4px',
      },
    };
    return notes.map((note) => registerUsers.map((user) => {
      if (note.sender === user._id) {
        return (
          <Card
            key={note._id}
            style={{ marginBottom: '30px' }}
            initiallyExpanded
          >
            <CardHeader
              title={note.title}
              subtitle={moment(note.sendAt).format('YYYY-MM-DD')}
              avatar={user.profile.avatar}
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
                iconStyle={styles.flipReplyStyle}
                style={styles.replyStyle}
                touch
              ><ReplyIcon />
              </IconButton>
              <IconButton
                tooltip="标记已读"
                tooltipPosition="top-center"
                iconStyle={{ color: '#999' }}
                style={styles.checkboxStyle}
                touch
              ><CheckBoxIcon />
              </IconButton>
            </CardActions>
          </Card>
        );
      }
      return false;
    }));
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
  registerUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const noteHandle = Meteor.subscribe('Notes.ownNotes');
  const dataIsReady = noteHandle.ready();
  const notes = Notes.find({}, {
    sort: { createdAt: -1 },
    limit: 5,
  }).fetch();
  return {
    dataIsReady,
    notes,
  };
}, UserNotes);
