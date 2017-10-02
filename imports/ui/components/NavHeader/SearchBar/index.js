import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { Form, Input } from './SearchBar.style.js';

const SearchBar = ({ history, classes, onChange, onSubmit }) => (
  <AppBar
    className={classes.appbar}
    position="fixed"
  >
    <Toolbar className={classes.toolbar}>
      {/* LeftContent */}
      <IconButton
        color="contrast"
        aria-label="Back"
        onClick={() => history.goBack()}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Content */}
      <Form onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="搜索"
          onChange={onChange}
        />
      </Form>

    </Toolbar>
  </AppBar>
);

SearchBar.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

const styles = {
  appbar: {
    backgroundColor: '#455a64',
  },

  toolbar: {
    minHeight: 64,
  },
};


export default withRouter(withStyles(styles)(SearchBar));
