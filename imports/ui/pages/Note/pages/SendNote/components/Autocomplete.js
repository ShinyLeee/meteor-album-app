import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Autocomplete from 'react-autocomplete';
import Avatar from 'material-ui/Avatar';
import Input from 'material-ui/Input';
import List, { ListItem, ListItemText } from 'material-ui/List';

const filter = (item, value) => !!value && item.username.toLowerCase().indexOf(value.trim().toLowerCase()) > -1;

class AutocompleteWrapper extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
  }

  _handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  }

  _handleComplete = (value) => {
    if (this.props.onComplete) {
      this.props.onComplete(value);
    }
  }

  _renderMenu = (items, value, style) => {
    const { classes } = this.props;
    return items.length > 0 ? (
      <List className={classes.listMenu} style={{ ...style }}>
        {
          React.Children.map(items, (item, key) => React.cloneElement(item, { key }))
        }
      </List>
    ) : <div />;
  }

  _renderItem = (item) => (
    <ListItem>
      <Avatar src={item.profile.avatar} />
      <ListItemText primary={item.username} />
    </ListItem>
  );

  // eslint-disable-next-line arrow-body-style
  _renderInput = ({ className, placeholder, value, ref, onChange, ...others }) => {
    return (
      <Input
        inputRef={ref}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disableUnderline
        fullWidth
        {...others}
      />
    );
  };

  render() {
    const { value, data, classes } = this.props;
    return (
      <Autocomplete
        wrapperStyle={{ width: '100%' }}
        getItemValue={(item) => item.username}
        items={data}
        shouldItemRender={filter}
        renderMenu={this._renderMenu}
        renderItem={this._renderItem}
        renderInput={this._renderInput}
        inputProps={{
          className: classes.input,
          placeholder: '发送给',
          value,
        }}
        value={value}
        onChange={this._handleChange}
        onSelect={this._handleComplete}
        autoHighlight={false}
      />
    );
  }
}

const styles = {
  input: {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    padding: '0 20px',
  },

  listMenu: {
    borderRadius: '3px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    background: '#fff',
    padding: '2px 0',
    fontSize: '90%',
    position: 'fixed',
    overflow: 'auto',
    maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
    zIndex: 9999,
  },
};

export default withStyles(styles)(AutocompleteWrapper);
