import PropTypes from 'prop-types';
import React from 'react';
import settings from '/imports/utils/settings';
import { Wrapper, Inner, Header, Info } from './EmptyHolder.style.js';

const source = `${settings.sourceDomain}/GalleryPlus/Default/empty.png`;

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
