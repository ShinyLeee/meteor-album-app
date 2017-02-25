/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  left: 0;
  top: ${props => props.isDefaultLayout ? 0 : '48px'};
  margin-bottom: 48px;
`;
