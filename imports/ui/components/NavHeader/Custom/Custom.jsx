import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import { purple500 } from 'material-ui/styles/colors.js';
import { Wrapper, styles } from '../NavHeader.style.js';

const CustomNavHeader = (props) => {
  const {
    style,
    titleStyle,
    ...others
  } = props;
  return (
    <Wrapper>
      <AppBar
        style={Object.assign({}, { backgroundColor: purple500 }, style)}
        titleStyle={Object.assign({}, styles.AppBarTitle, titleStyle)}
        {...others}
      />
    </Wrapper>
  );
};

CustomNavHeader.displayName = 'CustomNavHeader';

CustomNavHeader.propTypes = {
  /**
   * Below:
   *
   * The below props are all pass to AppBar Component,
   * when primary is false.
   * see: http://www.material-ui.com/#/components/app-bar
   */
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  style: PropTypes.object,
  showMenuIconButton: PropTypes.bool,
  onTitleTouchTap: PropTypes.func,
  iconElementLeft: PropTypes.element,
  iconElementRight: PropTypes.element,
  onLeftIconButtonTouchTap: PropTypes.func,
};

export default CustomNavHeader;
