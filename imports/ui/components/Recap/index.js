import PropTypes from 'prop-types';
import React from 'react';
import IconButton from 'material-ui/IconButton';
import { Github, Wechat, Twitter, Instagram, Website } from '../SubMaterialUI/SvgIcons.js';
import { Wrapper, Title, Detail, IconList } from './Recap.style.js';

const Recap = ({ title, detailFir, detailSec, showIcon }) => (
  <Wrapper>
    <Title>{title}</Title>
    <Detail>{detailFir}</Detail>
    <Detail>{detailSec}</Detail>
    {
      showIcon && (
        <IconList>
          <IconButton
            href="https://github.com/ShinyLeee"
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
          >
            <Github />
          </IconButton>
          <IconButton href="#">
            <Wechat />
          </IconButton>
          <IconButton
            href="https://twitter.com/shinylee007"
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
          >
            <Twitter />
          </IconButton>
          <IconButton
            href="https://www.instagram.com/lshinylee"
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
          >
            <Instagram />
          </IconButton>
          <IconButton
            href="http://www.shinylee.cn"
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
          >
            <Website />
          </IconButton>
        </IconList>
      )
    }
  </Wrapper>
);

Recap.defaultProps = {
  showIcon: false,
};

Recap.propTypes = {
  title: PropTypes.string.isRequired,
  detailFir: PropTypes.string.isRequired,
  detailSec: PropTypes.string,
  showIcon: PropTypes.bool,
};

export default Recap;
