import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { Card, CardHeader, CardActions, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';

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

const NoteHolder = ({ isRead, sender, note, onReadNote }) => (
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
          {note.content}
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
              style={styles.checkboxStyle}
              iconStyle={{ color: '#999' }}
              onTouchTap={onReadNote}
              touch
            ><CheckBoxIcon />
            </IconButton>
          </CardActions>
        )
      }
    </Card>
  </div>
);

NoteHolder.defaultProps = {
  isRead: false,
};

NoteHolder.propTypes = {
  isRead: PropTypes.bool.isRequired,
  sender: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  onReadNote: PropTypes.func, // Not required bc AllNotePage do not need read notes
};

export default NoteHolder;
