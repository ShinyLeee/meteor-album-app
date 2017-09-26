import React, { PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { Card, CardHeader } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import QuillContent from '/imports/ui/components/Quill/QuillContent.jsx';
import {
  Wrapper,
  StyledCardText,
  StyledCardActions,
  inlineStyles,
} from './NoteHolder.style.js';

const formatter = buildFormatter(CNStrings);

const NoteHolder = ({ isRead, avatar, note, onReadBtnClick, history }) => (
  <Wrapper>
    <Card initiallyExpanded>
      <CardHeader
        title={note.title}
        subtitle={<TimeAgo date={note.sendAt} formatter={formatter} />}
        avatar={avatar}
        actAsExpander
        showExpandableButton
      />
      <StyledCardText expandable>
        <QuillContent content={note.content} />
      </StyledCardText>
      {
        !isRead
        && (
          <StyledCardActions>
            <IconButton
              style={inlineStyles.replyButton}
              iconStyle={inlineStyles.flipReplyIcon}
              onTouchTap={() => history.push(`/sendNote/?receiver=${note.receiver}`)}
            ><ReplyIcon />
            </IconButton>
            <IconButton
              style={inlineStyles.checkBoxButton}
              iconStyle={inlineStyles.checkBoxIcon}
              onTouchTap={onReadBtnClick}
            ><CheckBoxIcon />
            </IconButton>
          </StyledCardActions>
        )
      }
    </Card>
  </Wrapper>
);

NoteHolder.defaultProps = {
  isRead: false,
};

NoteHolder.propTypes = {
  isRead: PropTypes.bool.isRequired,
  avatar: PropTypes.string.isRequired,
  note: PropTypes.object.isRequired,
  onReadBtnClick: PropTypes.func, // Not required bc AllNotePage do not need read notes
  // Below Pass from React-Router
  history: PropTypes.object.isRequired,
};

export default withRouter(NoteHolder);
