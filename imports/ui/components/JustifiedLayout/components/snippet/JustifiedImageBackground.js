import PropTypes from 'prop-types';
import React from 'react';
import {
  Background,
  CircleSvg,
  BgdSvg,
  DoneSvg,
} from './snippet.style';

const JustifiedImageBackground = (props) => {
  const { isEditing, isSelect } = props;
  return (
    <Background isEditing={isEditing} isSelect={isSelect}>
      <CircleSvg isSelect={isSelect} width="24px" height="24px" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </CircleSvg>
      <BgdSvg isSelect={isSelect} width="24px" height="24px" viewBox="0 0 24 24">
        <radialGradient id="shadow" cx="38" cy="95.488" r="10.488" gradientTransform="matrix(1 0 0 -1 -26 109)" gradientUnits="userSpaceOnUse">
          <stop offset=".832" stopColor="#010101" /><stop offset="1" stopColor="#010101" stopOpacity="0" />
        </radialGradient>
        <circle opacity=".26" fill="url(#shadow)" cx="12" cy="13.512" r="10.488" />
        <circle fill="#FFF" cx="12" cy="12.2" r="8.292" />
      </BgdSvg>
      <DoneSvg isSelect={isSelect} width="24px" height="24px" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </DoneSvg>
    </Background>
  );
};

JustifiedImageBackground.displayName = 'JustifiedImageBackground';

JustifiedImageBackground.defaultProps = {
  isEditing: false,
  isSelect: false,
};

JustifiedImageBackground.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isSelect: PropTypes.bool.isRequired,
};

export default JustifiedImageBackground;
