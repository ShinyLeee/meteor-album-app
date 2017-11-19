/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-color: #eee;
  transform: translate3d(0px, 0px, 0px);
  overflow: hidden;
`;

export const SelectableImage = styled.img`
  width: 100%;
  height: 100%;
  transition: transform .135s cubic-bezier(0.0,0.0,0.2,1);
  transform: ${props => props.isSelect ? 'scale(.8)' : 'scale(1)'};
`;
