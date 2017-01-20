import React from 'react';
import AppBar from 'material-ui/AppBar';
import styles from '../../NavHeader.style.js';

const LoadingNavHeader = () => (
  <div className="component__NavHeader">
    <AppBar
      style={styles.AppBar}
      titleStyle={styles.AppBarTitle}
      title="登录中..."
    />
  </div>
);

LoadingNavHeader.displayName = 'LoadingNavHeader';

export default LoadingNavHeader;
