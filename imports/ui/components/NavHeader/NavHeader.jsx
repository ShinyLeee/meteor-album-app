import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';

import LoadingNavHeader from './components/LoadingNavHeader/LoadingNavHeader.jsx';
import ConnectedPrimaryNavHeader from './components/PrimaryNavHeader/index.js';
import styles from './NavHeader.style.js';

const NavHeader = (props) => {
  const {
    loading,
    primary,
    User,
    location,
    title,
    style,
    showMenuIconButton,
    onTitleTouchTap,
    iconElementLeft,
    iconElementRight,
    onLeftIconButtonTouchTap,
  } = props;

  if (loading) return (<LoadingNavHeader />);
  if (primary) return (<ConnectedPrimaryNavHeader User={User} location={location} />);
  return (
    <div className="component__NavHeader">
      <AppBar
        style={Object.assign({}, styles.AppBar, style)}
        titleStyle={styles.AppBarTitle}
        title={title}
        showMenuIconButton={showMenuIconButton}
        onTitleTouchTap={onTitleTouchTap}
        iconElementLeft={iconElementLeft}
        iconElementRight={iconElementRight}
        onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
      />
    </div>
  );
};

NavHeader.displayName = 'NavHeader';

NavHeader.defaultProps = {
  loading: false,
  primary: false,
};

NavHeader.propTypes = {
  User: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  /**
   * primary:
   *
   * If true, render a common NavHeader,
   */
  primary: PropTypes.bool.isRequired,
  /**
   * Below:
   *
   * The below props are all pass to AppBar Component,
   * when primary is false.
   * see: http://www.material-ui.com/#/components/app-bar
   */
  location: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
  showMenuIconButton: PropTypes.bool,
  onTitleTouchTap: PropTypes.func,
  iconElementLeft: PropTypes.element,
  iconElementRight: PropTypes.element,
  onLeftIconButtonTouchTap: PropTypes.func,
};

export default NavHeader;
