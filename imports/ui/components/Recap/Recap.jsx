import React, { PropTypes } from 'react';
import pure from 'recompose/pure';
import IconButton from 'material-ui/IconButton';

import { Github, Wechat, Twitter, Instagram, Website } from '../SubMaterialUI/SvgIcons.jsx';

const Recap = ({ title, detailFir, detailSec, showIcon }) => (
  <div className="recap">
    <h1 className="recap-title">{title}</h1>
    <p className="recap-detail recap-detail-1">{detailFir}</p>
    <p className="recap-detail recap-detail-2">{detailSec}</p>
    { showIcon ? (
      <ul className="recap-icons">
        <IconButton
          href="https://github.com/ShinyLeee"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github color="#999" hoverColor="#222" />
        </IconButton>
        <IconButton
          href="https://twitter.com/shinylee007"
          target="_blank"
          rel="noopener noreferrer"
        >
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

export default pure(Recap);
