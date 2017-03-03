import styled from 'styled-components';
import { CardActions, CardText } from 'material-ui/Card';

export const Wrapper = styled.div`
  marginBottom: 10px;
`;

export const StyledCardText = styled(CardText)`
  padding: 0;
`;

export const StyledCardActions = styled(CardActions)`
  height: 58px;
`;

export const inlineStyles = {
  replyButton: {
    position: 'absolute',
    right: '56px',
  },
  checkBoxButton: {
    position: 'absolute',
    right: '4px',
  },
  flipReplyIcon: {
    color: '#999',
    MozTransform: 'scaleX(-1)',
    WebkitTransform: 'scaleX(-1)',
    OTransform: 'scaleX(-1)',
    transform: 'scaleX(-1)',
  },
  checkBoxIcon: {
    color: '#999',
  },
};
