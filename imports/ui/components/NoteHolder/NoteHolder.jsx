import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { Card, CardHeader } from 'material-ui/Card';
import ReplyIcon from 'material-ui/svg-icons/content/reply';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import QuillContent from '/imports/ui/components/Quill/QuillContent.jsx';
import {
  Wrapper,
  StyledCardText,
  StyledCardActions,
  ReplyIconButton,
  CheckBoxIconButton,
} from './NoteHolder.style.js';

const formatter = buildFormatter(CNStrings);

const flipReplyStyle = {
  color: '#999',
  MozTransform: 'scaleX(-1)',
  WebkitTransform: 'scaleX(-1)',
  OTransform: 'scaleX(-1)',
  transform: 'scaleX(-1)',
};

const NoteHolder = ({ isRead, avatar, note, onReadBtnClick }) => (
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
            <ReplyIconButton
              iconStyle={flipReplyStyle}
              onTouchTap={() => browserHistory.push(`/sendNote/?receiver=${note.receiver}`)}
            ><ReplyIcon />
            </ReplyIconButton>
            <CheckBoxIconButton
              iconStyle={{ color: '#999' }}
              onTouchTap={onReadBtnClick}
            ><CheckBoxIcon />
            </CheckBoxIconButton>
          </StyledCardActions>
        )
      }
    </Card>
  </Wrapper>
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
