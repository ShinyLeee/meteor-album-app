import styled from 'styled-components';
import TimeAgo from 'react-timeago';
import Avatar from 'material-ui/Avatar';
import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';

export const CommentsWrapper = styled.div`
  overflow-x: hidden;
`;

export const CommentsSection = styled(List)`
  max-height: 275px;
  overflow-y: scroll;
  & > div:first-child {
    border-top: 1px solid #ebebeb;
  }
`;

export const StyledTimeAgo = styled(TimeAgo)`
  float: right;
  color: #666;
  font-size: 12px;
  word-wrap: break-word;
`;

export const StyledTextField = styled(TextField)`
  left: 56px;
`;

export const PublishSection = styled.section`
  position: relative;
  padding: 12px 16px 8px;
  border-top: 1px solid #ebebeb;
`;

export const PublisherAvatar = styled(Avatar)`
  position: absolute;
  vertical-align: middle;
`;

export const PublishFooter = styled.footer`
  text-align: right;
`;
