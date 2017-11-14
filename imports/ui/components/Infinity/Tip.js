import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
  padding-bottom: 20px;
  font-size: 14px;
  color: #333;
  text-align: center;
  background-color: #eee;
`;

const Tip = () => (
  <Wrapper key="Infinite__bottom">- 已经到底部啦 -</Wrapper>
);

export default Tip;
