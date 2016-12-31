import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { Card, CardHeader, CardActions, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import { readNote } from '/imports/api/notes/methods.js';
import { snackBarOpen } from '/imports/ui/redux/actions/actionTypes.js';

const formatter = buildFormatter(CNStrings);

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

class NoteHolder extends Component {

  constructor(props) {
    super(props);
    this.handleReadNote = this.handleReadNote.bind(this);
  }

  /**
   * call Meteor method and mark specific note is read.
   * @param {Object} e  - onTouchTap event object
   * @param {String} id - note id which has read
   */
  handleReadNote(e, id) {
    const { onReadNote, dispatch } = this.props;
    readNote.call({ noteId: id }, (err) => {
      if (err) {
        dispatch(snackBarOpen('发生未知错误'));
        throw new Meteor.Error(err);
      }
      onReadNote();
    });
  }

  render() {
    const { isRead, sender, note } = this.props;
    return (
      <div className="note-holder">
        <Card
          key={note._id}
          initiallyExpanded
        >
          <CardHeader
            title={note.title}
            subtitle={<TimeAgo date={note.sendAt} formatter={formatter} />}
            avatar={sender.profile.avatar}
            actAsExpander
            showExpandableButton
          />
          <CardText expandable>
            <div className="markdown-holder">
              { note.content }
            </div>
          </CardText>
          {
            !isRead
            && (
              <CardActions style={{ height: '58px' }}>
                <IconButton
                  tooltip="回复"
                  tooltipPosition="top-center"
                  iconStyle={styles.flipReplyStyle}
                  style={styles.replyStyle}
                  onTouchTap={() => browserHistory.push(`/sendNote/?receiver=${sender.username}`)}
                  touch
                ><ReplyIcon />
                </IconButton>
                <IconButton
                  tooltip="标记已读"
                  tooltipPosition="top-center"
                  iconStyle={{ color: '#999' }}
                  style={styles.checkboxStyle}
                  onTouchTap={(e) => this.handleReadNote(e, note._id)}
                  touch
                ><CheckBoxIcon />
                </IconButton>
              </CardActions>
            )
          }
        </Card>
      </div>
    );
  }
}

NoteHolder.defaultProps = {
  isRead: false,
};

NoteHolder.propTypes = {
  User: PropTypes.object.isRequired,
  sender: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  isRead: PropTypes.bool.isRequired,
  onReadNote: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(NoteHolder);
