import styled from 'styled-components';

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  background-color: #fff;
  overflow: hidden;
  z-index: 9999;
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ThumbnailSection = styled.section`
  position: absolute;
  left: 0;
  width: 100px;
  height: 100%;
  background-color: #eee;
  background-size: cover;
`;

export const DetailSection = styled.section`
  position: absolute;
  left: 100px;
  width: calc(100% - 100px);
  height: 100%;
  padding: 12px 16px 0 24px;
  color: #000;
`;

export const Message = styled.span`
  font-size: 13px;
  color: #888;
`;

export const DestMessage = styled.h4`
  margin: 4px 0 6px 0;
  min-height: 24px;
  font-size: 16px;
  font-weight: bold;
`;

export const StopButton = styled.a`
  margin-left: 20%;
  font-size: 14px;
  font-weight: bold;
  color: #3F51B5;
`;

export const Progress = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 4px;
  background-color: #3F51B5;
`;
