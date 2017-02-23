import styled from 'styled-components';
import { CardActions, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';

export const Wrapper = styled.div`
  marginBottom: 10px;
`;

export const StyledCardText = styled(CardText)`
  padding: 0;
`;

export const StyledCardActions = styled(CardActions)`
  height: 58px;
`;

export const ReplyIconButton = styled(IconButton)`
  position: absolute;
  right: 56px;
`;

export const CheckBoxIconButton = styled(IconButton)`
  position: absolute;
  right: 4px;
`;
