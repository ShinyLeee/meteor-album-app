import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';
import {
  Wrapper,
  Cover,
  CoverBackground,
  Header,
  HeaderTime,
  HeaderName,
  Footer,
  FooterAvatar,
  FooterUsername,
} from './styled.js';

const CollHolder = ({ User, coll, clientWidth, devicePixelRatio }) => {
  const realDimension = Math.round(clientWidth * devicePixelRatio);
  const fastSrc = `${coll.cover}?imageView2/2/w/${realDimension}`;
  const createdTime = moment(coll.createdAt).format('YYYY-MM-DD');
  const WrapperStyle = coll.cover.indexOf('VF_ac') > 0
                          ? {
                            backgroundSize: 'inherit',
                            backgroundImage: `url("${coll.cover}")`,
                          }
                          : {
                            backgroundSize: 'cover',
                            backgroundImage: `url("${fastSrc}")`,
                          };
  return (
    <Wrapper
      style={WrapperStyle}
      onTouchTap={() => browserHistory.push(`/user/${User.username}/collection/${coll.name}`)}
    >
      <Cover>
        <CoverBackground />
        <Header>
          <HeaderTime dateTime={createdTime}>{createdTime}</HeaderTime>
          <HeaderName>{coll.name}</HeaderName>
        </Header>
        <Footer>
          <FooterAvatar src={User.profile.avatar} alt={User.username} />
          <FooterUsername>{User.username}</FooterUsername>
        </Footer>
      </Cover>
    </Wrapper>
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
