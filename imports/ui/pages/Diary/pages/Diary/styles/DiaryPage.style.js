import styled from 'styled-components';

export const DiaryHeader = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: -1;
`;

export const DiaryControlCenter = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const DiaryYear = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DiaryYearText = styled.h1`
  flex: 0 0 65%;
  font-size: 56px;
  color: #fff;
  text-align: center;
`;

export const DiaryMonth = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 6px;
  color: #fff;
`;

export const DiaryMonthText = styled.span`
  position: relative;
  color: #f1f1f1;
`;

export const DiaryMonthSelectedText = DiaryMonthText.extend`
  font-size: 24px;
  color: #fff;
  &:before {
    position: absolute;
    display: block;
    content: " ";
    left: 0;
    bottom: -6px;
    width: 100%;
    height: 4px;
    background-color: rgb(33, 150, 243);
  }
`;
