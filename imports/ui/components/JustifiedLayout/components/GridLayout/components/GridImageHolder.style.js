/* eslint-disable no-confusing-arrow */
import React from 'react';
import styled from 'styled-components';

const D = (props) => <div {...props} />; // eslint-disable-line

export const Wrapper = styled(D)`
  position: absolute;
  background-color: ${props => props.isEditing ? '#eee' : '#fff'}
  transform: translate3d(0px, 0px, 0px);
  overflow: hidden;
`;

export const SelectableImage = styled.img`
  width: 100%;
  height: 100%;
  transition: transform .135s cubic-bezier(0.0,0.0,0.2,1);
  transform: ${props => props.isSelect ? 'scale(.8)' : 'scale(1)'};
`;
