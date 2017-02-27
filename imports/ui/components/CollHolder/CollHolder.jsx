import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import {
  Wrapper,
  Cover,
  Info,
  Avatar,
  CollName,
  UserName,
} from './CollHolder.style.js';

const CollHolder = (props) => {
  const { coll, avatarSrc } = props;
  return (
    <Wrapper
      onTouchTap={() => browserHistory.push(`/user/${coll.user}/collection/${coll.name}`)}
    >
      <Cover>
        <img src={coll.cover} role="presentation" />
      </Cover>
      <Info>
        <Avatar>
          <img src={avatarSrc} role="presentation" />
        </Avatar>
        <CollName>{coll.name}</CollName>
        <UserName>{coll.user}</UserName>
      </Info>
    </Wrapper>
  );
};

CollHolder.displayName = 'CollHolder';

CollHolder.propTypes = {
  coll: PropTypes.object.isRequired,
  avatarSrc: PropTypes.string.isRequired,
};

export default CollHolder;
