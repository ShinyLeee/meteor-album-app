import moment from 'moment';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import {
  Wrapper,
  Cover,
  Info,
  Avatar,
  CollName,
  UserName,
  Time,
} from './CollHolder.style.js';

const CollHolder = (props) => {
  const {
    clientWidth,
    devicePixelRatio,
    coll,
    showTime,
    avatarSrc,
  } = props;
  const realDimension = Math.round(clientWidth * devicePixelRatio);
  let fastSrc = `${coll.cover}?imageView2/2/w/${realDimension}`;
  if (coll.cover.indexOf('VF_ac') > 0) fastSrc = coll.cover;
  return (
    <Wrapper
      onTouchTap={() => browserHistory.push(`/user/${coll.user}/collection/${coll.name}`)}
    >
      <Cover>
        <img
          src={fastSrc}
          role="presentation"
        />
      </Cover>
      <Info>
        <Avatar>
          <img
            src={avatarSrc}
            role="presentation"
          />
        </Avatar>
        <CollName>{coll.name}</CollName>
        <UserName>{coll.user}</UserName>
        { showTime && <Time dateTime={coll.createdAt}>{moment(coll.createdAt).format('YYYY/M/D')}</Time>}
      </Info>
    </Wrapper>
  );
};

CollHolder.displayName = 'CollHolder';

CollHolder.defaultProps = {
  clientWidth: document.body.clientWidth,
  devicePixelRatio: window.devicePixelRatio,
  showTime: false,
};

CollHolder.propTypes = {
  clientWidth: PropTypes.number.isRequired,
  devicePixelRatio: PropTypes.number.isRequired,
  coll: PropTypes.object.isRequired,
  showTime: PropTypes.bool.isRequired,
  avatarSrc: PropTypes.string.isRequired,
};

export default CollHolder;
