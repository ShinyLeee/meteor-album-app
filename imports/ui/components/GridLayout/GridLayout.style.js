import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: ${props => props.margin};
`;

export const Child = styled.div`
  position: relative;
  display: inline-block;
  width: ${props => props.childWidth};
  height: 0;
  padding: ${props => props.padding}
  paddingBottom: ${props => props.paddingBottom}
  verticalAlign: top;
`;
