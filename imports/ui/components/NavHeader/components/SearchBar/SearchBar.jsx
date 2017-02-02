import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';

import styles from '../../NavHeader.style.js';

const SearchBar = ({ onLeftIconTouchTap, onChange, onSubmit }) => (
  <AppBar
    className="component__SearchBar"
    style={Object.assign({}, styles.AppBar, { backgroundColor: '#455a64' })}
    iconElementLeft={<IconButton onTouchTap={onLeftIconTouchTap}><ArrowBackIcon /></IconButton>}
    title={
      <form style={styles.SearchBarHolder} onSubmit={onSubmit}>
        <input
          className="SearchBar__input"
          style={styles.SearchBarInput}
          type="text"
          placeholder="搜索"
          onChange={onChange}
        />
      </form>}
  />
);

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  onLeftIconTouchTap: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
