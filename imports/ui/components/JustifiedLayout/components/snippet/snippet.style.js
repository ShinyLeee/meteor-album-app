/* eslint-disable no-confusing-arrow */
import styled from 'styled-components';

export const SelectIcon = styled.svg`
  fill: ${props => props.activate ? '#4285f4' : 'rgba(0,0,0,0.54)'};
  fill-opacity: 1;
`;

export const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 8px 24px 24px 8px;
  opacity: ${props => props.isEditing ? 1 : 0}
  background: ${props => props.isSelect
                          ? 'none'
                          : 'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3))'}
  z-index: 1;
`;

export const CircleSvg = styled.svg`
  position: absolute;
  fill: #fff;
  fill-opacity: ${props => props.isSelect ? 0 : 0.54};
`;

export const BgdSvg = styled.svg`
  position: absolute;
  display: ${props => props.isSelect ? 'block' : 'none'}
`;

export const DoneSvg = styled.svg`
  position: absolute;
  fill: ${props => props.isSelect ? 'rgb(66, 133, 244)' : '#fff'}
  fill-opacity: ${props => props.isSelect ? 1 : 0};
  opacity: ${props => props.isSelect ? 1 : 0};
`;
