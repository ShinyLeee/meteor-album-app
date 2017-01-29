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

const NoteHolder = ({ isRead, avatar, note, onReadBtnClick }) => (
  <div className="component__NoteHolder">
    <Card initiallyExpanded>
      <CardHeader
        title={note.title}
        subtitle={<TimeAgo date={note.sendAt} formatter={formatter} />}
        avatar={avatar}
        actAsExpander
        showExpandableButton
      />
      <CardText expandable>
        <div className="NoteHolder__content">
          {note.content}
        </div>
      </CardText>
      {
        !isRead
        && (
          <CardActions style={{ height: '58px' }}>
            <IconButton
              iconStyle={styles.flipReplyStyle}
              style={styles.replyStyle}
              onTouchTap={() => browserHistory.push(`/sendNote/?receiver=${note.receiver}`)}
            ><ReplyIcon />
            </IconButton>
            <IconButton
              style={styles.checkboxStyle}
              iconStyle={{ color: '#999' }}
              onTouchTap={onReadBtnClick}
            ><CheckBoxIcon />
            </IconButton>
          </CardActions>
        )
      }
    </Card>
  </div>
);

NoteHolder.displayName = 'NoteHolder';

NoteHolder.defaultProps = {
  isRead: false,
};

NoteHolder.propTypes = {
  isRead: PropTypes.bool.isRequired,
  avatar: PropTypes.string.isRequired,
  note: PropTypes.object.isRequired,
  onReadBtnClick: PropTypes.func, // Not required bc AllNotePage do not need read notes
};

export default NoteHolder;
