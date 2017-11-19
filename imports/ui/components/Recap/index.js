import React from 'react';
import IconButton from 'material-ui/IconButton';
import { Github, Wechat, Twitter, Instagram, Website } from '../SubMaterialUI/SvgIcons';
import { Wrapper, Title, Detail, IconList } from './Recap.style';

const Recap = () => (
  <Wrapper>
    <Title>Gallery<sup>&nbsp;+</sup></Title>
    <Detail>Vivian的私人相册</Detail>
    <Detail>Created By Shiny Lee</Detail>
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
  </Wrapper>
);

export default Recap;
