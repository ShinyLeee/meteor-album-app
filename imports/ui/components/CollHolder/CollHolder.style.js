import styled from 'styled-components';
import Paper from 'material-ui/Paper';

export const Wrapper = styled(Paper)`
  position: relative;
  display: inline-block;
  width: calc(50% - 2px);
  margin-top: 4px;
  cursor: pointer;
  &:nth-child(even) {
    margin-left: 4px;
  }
`;

export const Cover = styled.section`
  width: 100%;
  height: 200px;
  backgroundColor: #eee;
  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Info = styled.section`
  margin: -18px 0 18px 12px;
`;

export const Avatar = styled.div`
  display: inline-block;
  width: 26px;
  height: 26px;
  & > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export const CollName = styled.div`
  margin-top: 4px;
`;

export const UserName = styled.div`
  font-size: 12px;
  color: #666;
`;
