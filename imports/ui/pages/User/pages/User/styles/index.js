import styled from 'styled-components';

export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const MainSection = styled.section`
  text-align: center;
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-top: -60px;
  overflow: hidden;
  & > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid #fff;
  }
`;

export const Detail = styled.div`
  margin-bottom: 20px;
  text-align: center;
  & > h4 {
    margin: 10px 0;
    color: #222;
  }
  & > span {
    font-size: 14px;
    color: #999;
  }
`;

export const CounterSection = styled.section`
  display: flex;
  margin: 20px 0 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  color: #777777;
`;

export const Counter = styled.div`
  flex: 1;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  & > span {
    display: block;
  }
  & > span:first-child {
    margin-bottom: 6px;      
    font-weight: bold;
    color: #212121;
  }
  &:nth-child(2) {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
`;

export const RankSection = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  padding: 0 20px;
`;
