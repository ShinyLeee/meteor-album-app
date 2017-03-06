import React, { PropTypes } from 'react';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import CollHolder from '/imports/ui/components/CollHolder/CollHolder.jsx';
import {
  inlineStyles,
  Wrapper,
  AddWrapper,
  AddSvgWrapper,
  AddMessage,
} from './Own.style.js';

const OwnedCollection = (props) => {
  const { isGuest, curUser, colls, onAddClick } = props;
  const avatarSrc = curUser.profile.avatar;
  return (
    <Wrapper>
      {
        !isGuest && (
          <AddWrapper onTouchTap={onAddClick}>
            <AddSvgWrapper><AddIcon style={inlineStyles.addIcon} /></AddSvgWrapper>
            <AddMessage>添加相册</AddMessage>
          </AddWrapper>
        )
      }
      {
        colls.map((coll, i) => (
          <CollHolder
            key={i}
            coll={coll}
            avatarSrc={avatarSrc}
            showTime
          />
        ))
      }
    </Wrapper>
  );
};

OwnedCollection.displayName = 'OwnedCollection';

OwnedCollection.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  curUser: PropTypes.object.isRequired,
  colls: PropTypes.array.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

export default OwnedCollection;
