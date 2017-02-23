import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { Github, Wechat, Twitter, Instagram, Website } from '../SubMaterialUI/SvgIcons.jsx';
import { Wrapper, Title, Detail, IconList } from './Recap.style.js';

const Recap = ({ title, detailFir, detailSec, showIcon }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Detail>{detailFir}</Detail>
    <Detail>{detailSec}</Detail>
    { showIcon && (
      <IconList>
        <IconButton
          href="https://github.com/ShinyLeee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github color="#999" hoverColor="#222" />
        </IconButton>
        <IconButton href="#">
          <Wechat color="#999" hoverColor="#222" />
        </IconButton>
        <IconButton
          href="https://twitter.com/shinylee007"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter color="#999" hoverColor="#222" />
        </IconButton>
        <IconButton
          href="https://www.instagram.com/lshinylee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram color="#999" hoverColor="#222" />
        </IconButton>
        <IconButton
          href="http://www.shinylee.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Website color="#999" hoverColor="#222" />
        </IconButton>
      </IconList>)
    }
  </Wrapper>
);

Recap.displayName = 'Recap';

Recap.defaultProps = {
  showIcon: false,
};

Recap.propTypes = {
  title: PropTypes.string.isRequired,
  detailFir: PropTypes.string.isRequired,
  detailSec: PropTypes.string,
  showIcon: PropTypes.bool.isRequired,
};

export default Recap;
