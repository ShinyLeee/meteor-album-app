import styled from 'styled-components';
import { CircularProgress } from 'material-ui/Progress';

export const LoadingCircularProgress = styled(CircularProgress)`
  color: ${props => props.color};
  verticalAlign: bottom;
`;

export const LoadingMessage = styled.span`
  marginLeft: 32px;
  lineHeight: 40px;
  color: #222;
`;
