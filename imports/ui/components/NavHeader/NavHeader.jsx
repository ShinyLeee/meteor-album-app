import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import LoadingNavHeader from './components/LoadingNavHeader/LoadingNavHeader.jsx';
import ConnectedPrimaryNavHeader from './components/PrimaryNavHeader/index.js';
import SecondaryNavHeader from './components/SecondaryNavHeader/SecondaryNavHeader.jsx';
import styles from './NavHeader.style.js';

const NavHeader = (props) => {
  const {
    loading,
    primary,
    secondary,
    User,
    location,
    title,
    titleStyle,
    style,
    iconColor,
    showMenuIconButton,
    onTitleTouchTap,
    iconElementLeft,
    iconElementRight,
    onLeftIconButtonTouchTap,
  } = props;

  if (loading) return (<LoadingNavHeader />);
  if (primary) return (<ConnectedPrimaryNavHeader User={User} location={location} />);
  if (secondary) {
    return (
      <SecondaryNavHeader
        title={title}
        titleStyle={titleStyle}
        iconElementRight={iconElementRight}
        style={style}
        iconColor={iconColor}
      />);
  }
  return (
    <AppBar
      style={Object.assign({}, styles.AppBar, style)}
      titleStyle={Object.assign({}, styles.AppBarTitle, titleStyle)}
      title={title}
      showMenuIconButton={showMenuIconButton}
      onTitleTouchTap={onTitleTouchTap}
      iconElementLeft={iconElementLeft}
      iconElementRight={iconElementRight}
      onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
    />
  );
};

NavHeader.displayName = 'NavHeader';

NavHeader.defaultProps = {
  loading: false,
  primary: false,
  secondary: false,
};

NavHeader.propTypes = {
  User: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  primary: PropTypes.bool.isRequired,
  secondary: PropTypes.bool.isRequired,
  /**
   * Below:
   *
   * The below props are all pass to AppBar Component,
   * when primary is false.
   * see: http://www.material-ui.com/#/components/app-bar
   */
  location: PropTypes.string,
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  style: PropTypes.object,
  iconColor: PropTypes.string, // only SecondaryNavHeader use it
  showMenuIconButton: PropTypes.bool,
  onTitleTouchTap: PropTypes.func,
  iconElementLeft: PropTypes.element,
  iconElementRight: PropTypes.element,
  onLeftIconButtonTouchTap: PropTypes.func,
};

export default NavHeader;
