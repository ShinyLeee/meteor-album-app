import { Meteor } from 'meteor/meteor';
import React, { PropTypes } from 'react';

const EmptyHolder = ({ src, header, mainInfo, secInfo }) => (
  <div className="component__Empty">
    <div className="Empty__container">
      <img
        className="Empty__logo"
        src={src}
        role="presentation"
      />
      <h2 className="Empty__header">{header}</h2>
      <p className="Empty__info">{mainInfo}</p>
      <p className="Empty__info">{secInfo}</p>
    </div>
  </div>
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
