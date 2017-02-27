import React from 'react';
import AppBar from 'material-ui/AppBar';
import { purple500 } from 'material-ui/styles/colors.js';
import { Wrapper, styles } from '../NavHeader.style.js';

const LoadingNavHeader = () => (
  <Wrapper>
    <AppBar
      style={{ backgroundColor: purple500 }}
      titleStyle={styles.AppBarTitle}
      title="登录中..."
    />
  </Wrapper>
);

LoadingNavHeader.displayName = 'LoadingNavHeader';

export default LoadingNavHeader;
