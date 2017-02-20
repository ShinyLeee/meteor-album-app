import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';

const CollHolder = ({ User, coll, clientWidth, devicePixelRatio }) => {
  const realDimension = Math.round(clientWidth * devicePixelRatio);
  const fastSrc = `${coll.cover}?imageView2/2/w/${realDimension}`;
  const collHolderStyle = coll.cover.indexOf('VF_ac') > 0
                          ? {
                            backgroundSize: 'inherit',
                            backgroundImage: `url("${coll.cover}")`,
                          }
                          : {
                            backgroundSize: 'cover',
                            backgroundImage: `url("${fastSrc}")`,
                          };
  return (
    <div
      className="component__CollHolder"
      style={collHolderStyle}
      onTouchTap={() => browserHistory.push(`/user/${User.username}/collection/${coll.name}`)}
    >
      <div className="CollHolder__cover">
        <div className="CollHolder__background" />
        <div className="CollHolder__header">
          <h4 className="CollHolder__time">{moment(coll.createdAt).format('YYYY-MM-DD')}</h4>
          <h2 className="CollHolder__name">{coll.name}</h2>
        </div>
        <div className="CollHolder__footer">
          <img className="CollHolder__avatar" src={User.profile.avatar} alt={User.username} />
          <span className="CollHolder__username">{User.username}</span>
        </div>
      </div>
    </div>
  );
};

CollHolder.displayName = 'CollHolder';

CollHolder.defaultProps = {
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
};

CollHolder.propTypes = {
  User: PropTypes.object.isRequired,
  coll: PropTypes.object.isRequired,
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
};

export default CollHolder;
