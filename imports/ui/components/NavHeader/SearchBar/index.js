import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import NavHeader from '../NavHeader';
import { Form, Input } from './SearchBar.style';

class SearchBar extends PureComponent {
  static propTypes = {
    height: PropTypes.number,
    onBack: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  render() {
    const {
      height,
      onBack,
      onChange,
      onSubmit,
      history,
      classes,
    } = this.props;
    return (
      <NavHeader height={height}>
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
      </NavHeader>
    );
  }
}

const styles = theme => ({
  appbar: {
    backgroundColor: '#455a64',
    backgroundImage: theme.palette.gradients.viciousStance,
  },

  toolbar: {
    minHeight: 64,
  },
});

export default compose(
  withStyles(styles),
  withRouter,
)(SearchBar);
