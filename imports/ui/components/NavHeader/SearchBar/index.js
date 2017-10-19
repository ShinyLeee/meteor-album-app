import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import { Form, Input } from './SearchBar.style';

const SearchBar = ({ history, classes, onBack, onChange, onSubmit }) => (
  <AppBar
    className={classes.appbar}
    position="fixed"
  >
    <Toolbar className={classes.toolbar}>
      {/* LeftContent */}
      <IconButton
        color="contrast"
        aria-label="Back"
        onClick={() => (onBack && onBack()) || history.goBack()}
      ><ArrowBackIcon />
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
  onBack: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = {
  appbar: {
    backgroundColor: '#455a64',
  },

  toolbar: {
    minHeight: 64,
  },
};

export default compose(
  withStyles(styles),
  withRouter,
)(SearchBar);
