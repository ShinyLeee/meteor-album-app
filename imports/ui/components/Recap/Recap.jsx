import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';

import { Github, Wechat, Twitter, Instagram, Website } from '../SubMaterialUI/SvgIcons.jsx';

const Recap = ({ title, detailFir, detailSec, showIcon }) => (
  <div className="component__Recap">
    <h1 className="Recap__title">{title}</h1>
    <p className="Recap__detail Recap__detail-1">{detailFir}</p>
    <p className="Recap__detail Recap__detail-2">{detailSec}</p>
    { showIcon ? (
      <ul className="Recap__icons">
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
      </ul>
    ) : null }
  </div>
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
