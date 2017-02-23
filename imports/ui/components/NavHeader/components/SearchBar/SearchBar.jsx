import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import styles from '../../NavHeader.style.js';
import { Form, Input } from './SearchBar.style.js';

const SearchBar = ({ onLeftIconTouchTap, onChange, onSubmit }) => (
  <AppBar
    style={Object.assign({}, styles.AppBar, { backgroundColor: '#455a64' })}
    iconElementLeft={<IconButton onTouchTap={onLeftIconTouchTap}><ArrowBackIcon /></IconButton>}
    title={
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="搜索"
          onChange={onChange}
        />
      </Form>}
  />
);

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  onLeftIconTouchTap: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
