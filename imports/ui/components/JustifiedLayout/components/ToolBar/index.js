import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui-icons/ViewComfy';
import CompactIcon from 'material-ui-icons/ViewCompact';
import FilterIcon from 'material-ui-icons/FilterList';
import JustifiedSelectIcon from '../snippet/JustifiedSelectIcon';
import { Toolbar, ToolbarLeft } from './ToolBar.style';

export default class JustifiedToolBar extends PureComponent {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isAllSelect: PropTypes.bool.isRequired,
    layoutType: PropTypes.oneOf(['group', 'grid']),
    filterType: (props, propName, componentName) => {
      let allowedProps;
      if (props.layoutType === 'group') allowedProps = ['day', 'month', 'year'];
      else if (props.layoutType === 'grid') allowedProps = ['latest', 'oldest', 'popular'];
      if (!allowedProps.includes(props[propName])) {
        return new Error(
          `Invalid prop \`${propName}\` of value \`${props[propName]}\` `
          + `supplied to \`${componentName}\`, expected one of ${JSON.stringify(allowedProps)}, `
          + `when layoutType prop is ${props.layoutType}.`,
        );
      }
      return null;
    },
    onSelectAll: PropTypes.func.isRequired,
    onLayoutChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    layoutType: 'group',
    filterType: 'day',
  }

  state = {
    anchorEl: null,
  }

  _handleRenderMenu = (evt) => {
    this.setState({ anchorEl: evt.currentTarget });
  }

  _handleRequestClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const {
      isEditing,
      isAllSelect,
      layoutType,
      filterType,
      onSelectAll,
      onLayoutChange,
      onFilterChange,
    } = this.props;
    const isGroupLayout = layoutType === 'group';
    return (
      <Toolbar>
        <ToolbarLeft visible={isEditing} onClick={onSelectAll}>
          <JustifiedSelectIcon activate={isAllSelect} />
          <h4>选择全部</h4>
        </ToolbarLeft>
        <div>
          <IconButton onClick={() => onLayoutChange('group')}>
            <CompactIcon color={isGroupLayout ? '#111' : '#757575'} />
          </IconButton>
          <IconButton onClick={() => onLayoutChange('grid')}>
            <ComfyIcon color={isGroupLayout ? '#757575' : '#111'} />
          </IconButton>
          <IconButton onClick={this._handleRenderMenu}>
            <FilterIcon />
          </IconButton>
          <Menu
            open={!!this.state.anchorEl}
            anchorEl={this.state.anchorEl}
            onRequestClose={this._handleRequestClose}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            {
              isGroupLayout
              ? [
                <MenuItem
                  key="menu__day"
                  onClick={() => onFilterChange('day')}
                  selected={filterType === 'day'}
                >按日排列
                </MenuItem>,
                <MenuItem
                  key="menu__month"
                  onClick={() => onFilterChange('month')}
                  selected={filterType === 'month'}
                >按月排列
                </MenuItem>,
                <MenuItem
                  key="menu__year"
                  onClick={() => onFilterChange('year')}
                  selected={filterType === 'year'}
                >按年排列
                </MenuItem>,
              ]
              : [
                <MenuItem
                  key="menu__latest"
                  onClick={() => onFilterChange('latest')}
                  selected={filterType === 'latest'}
                >最近的
                </MenuItem>,
                <MenuItem
                  key="menu__longest"
                  onClick={() => onFilterChange('oldest')}
                  selected={filterType === 'oldest'}
                >最久前的
                </MenuItem>,
                <MenuItem
                  key="menu__popular"
                  onClick={() => onFilterChange('popular')}
                  selected={filterType === 'popular'}
                >最受欢迎的
                </MenuItem>,
              ]
            }
          </Menu>
        </div>
      </Toolbar>
    );
  }
}
