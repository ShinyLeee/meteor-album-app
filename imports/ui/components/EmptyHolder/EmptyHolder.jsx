import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';
import { Wrapper, Inner, Header, Info } from './EmptyHolder.style.js';

const EmptyHolder = ({ src, header, mainInfo, secInfo }) => (
  <Wrapper>
    <Inner>
      <img src={src} role="presentation" />
      <Header>{header}</Header>
      <Info>{mainInfo}</Info>
      <Info>{secInfo}</Info>
    </Inner>
  </Wrapper>
);

EmptyHolder.displayName = 'EmptyHolder';

EmptyHolder.defaultProps = {
  src: `${Meteor.settings.public.sourceDomain}/GalleryPlus/Default/empty.png`,
  header: 'Oops',
};

EmptyHolder.propTypes = {
  src: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  mainInfo: PropTypes.string.isRequired,
  secInfo: PropTypes.string,
};

export default EmptyHolder;
