import styled from 'styled-components';
import Paper from 'material-ui/Paper';

export const TabView = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 4px;
`;

export const Wrapper = styled(Paper)`
  display: inline-block;
  width: calc(50% - 2px);
  max-width: 225px;
  margin-top: 4px;
  cursor: pointer;
`;

export const Cover = styled.section`
  width: 100%;
  height: 180px;
  background-color: #eee;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Info = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 12px 28px 16px 12px
`;

export const CollName = styled.div`
  width: 100%;
  margin-top: 4px;
  text-overflow: ellipsis;
  white-space:nowrap;
  overflow: hidden;
`;

export const UserName = styled.div`
  font-size: 13px;
  color: #666;
`;

export const Time = styled.time`
  font-size: 12px;
  color: #999;
`;
