import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Wrapper, Inner, Header, Info } from './EmptyHolder.style.js';

const source = `${Meteor.settings.public.sourceDomain}/GalleryPlus/Default/empty.png`;

const EmptyHolder = ({ header, mainInfo, secInfo }) => (
  <Wrapper>
    <Inner>
      <img src={source} role="presentation" />
      <Header>{header}</Header>
      <Info>{mainInfo}</Info>
      <Info>{secInfo}</Info>
    </Inner>
  </Wrapper>
);

EmptyHolder.defaultProps = {
  header: 'Oops',
};

EmptyHolder.propTypes = {
  header: PropTypes.string.isRequired,
  mainInfo: PropTypes.string.isRequired,
  secInfo: PropTypes.string,
};

export default EmptyHolder;
