import PropTypes from 'prop-types';
import React from 'react';
import {
  Wrapper,
  Title,
  Article,
  Footer,
} from '../styles/DiaryHolder.style';

const DiaryHolder = ({ diary, onDiaryClick }) => (
  <Wrapper>
    <header>
      <Title>{diary.title}</Title>
    </header>
    <Article onClick={() => onDiaryClick(diary)}>
      {diary.outline}
    </Article>
    <Footer>
      <time dateTime={diary.time}>{diary.time}</time>
    </Footer>
  </Wrapper>
);

DiaryHolder.propTypes = {
  diary: PropTypes.object.isRequired,
  onDiaryClick: PropTypes.func.isRequired,
};

export default DiaryHolder;
