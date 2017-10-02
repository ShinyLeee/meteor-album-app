import PropTypes from 'prop-types';
import React from 'react';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import ComfyIcon from 'material-ui-icons/ViewComfy';
import CompactIcon from 'material-ui-icons/ViewCompact';
import FilterIcon from 'material-ui-icons/FilterList';
import JustifiedSelectIcon from '../snippet/JustifiedSelectIcon';
import { Toolbar, ToolbarLeft, ToolbarRight } from './ToolBar.style.js';

const JustifiedToolBar = (props) => {
  const {
    isEditing,
    isAllSelect,
    layoutType,
    filterType,
    onSelectAll,
    onLayoutChange,
    onFilterChange,
  } = props;
  const isDefaultLayout = layoutType === 'group';
  return (
    <Toolbar>
      { isEditing && (
        <ToolbarLeft onClick={onSelectAll}>
          <JustifiedSelectIcon activate={isAllSelect} />
          <h4>选择全部</h4>
        </ToolbarLeft>
      ) }
      <ToolbarRight>
        <IconButton onClick={() => onLayoutChange('group')}>
          <CompactIcon color={isDefaultLayout ? '#111' : '#757575'} />
        </IconButton>
        <IconButton onClick={() => onLayoutChange('grid')}>
          <ComfyIcon color={isDefaultLayout ? '#757575' : '#111'} />
        </IconButton>
        <Menu
          iconButtonElement={<IconButton><FilterIcon color="#757575" /></IconButton>}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        >
          {
            isDefaultLayout
            ? (
              <div>
                <MenuItem
                  primaryText="按日排列"
                  onClick={() => onFilterChange('day')}
                  insetChildren={filterType !== 'day'}
                  checked={filterType === 'day'}
                  disabled={filterType === 'day'}
                />
                <MenuItem
                  primaryText="按月排列"
                  onClick={() => onFilterChange('month')}
                  insetChildren={filterType !== 'month'}
                  checked={filterType === 'month'}
                  disabled={filterType === 'month'}
                />
                <MenuItem
                  primaryText="按年排列"
                  onClick={() => onFilterChange('year')}
                  insetChildren={filterType !== 'year'}
                  checked={filterType === 'year'}
                  disabled={filterType === 'year'}
                />
              </div>
            )
            : (
              <div>
                <MenuItem
                  primaryText="最近的"
                  onClick={() => onFilterChange('latest')}
                  insetChildren={filterType !== 'latest'}
                  checked={filterType === 'latest'}
                  disabled={filterType === 'latest'}
                />
                <MenuItem
                  primaryText="最久前的"
                  onClick={() => onFilterChange('oldest')}
                  insetChildren={filterType !== 'oldest'}
                  checked={filterType === 'oldest'}
                  disabled={filterType === 'oldest'}
                />
                <MenuItem
                  primaryText="最受欢迎的"
                  onClick={() => onFilterChange('popular')}
                  insetChildren={filterType !== 'popular'}
                  checked={filterType === 'popular'}
                  disabled={filterType === 'popular'}
                />
              </div>
            )
          }
        </Menu>
      </ToolbarRight>
    </Toolbar>
  );
};

JustifiedToolBar.displayName = 'JustifiedToolBar';

JustifiedToolBar.defaultProps = {
  layoutType: 'group',
  filterType: 'day',
};

JustifiedToolBar.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isAllSelect: PropTypes.bool.isRequired,
  layoutType: PropTypes.oneOf(['group', 'grid']).isRequired,
  filterType: (props, propName, componentName) => {
    let allowedProps;
    if (props.layoutType === 'group') allowedProps = ['day', 'month', 'year'];
    else if (props.layoutType === 'grid') allowedProps = ['latest', 'oldest', 'popular'];
    if (!allowedProps.includes(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` of value \`${props[propName]}\` `
        + `supplied to \`${componentName}\`, expected one of ${JSON.stringify(allowedProps)}, `
        + `when layoutType prop is ${props.layoutType}.`
      );
    }
    return null;
  },
  onSelectAll: PropTypes.func.isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default JustifiedToolBar;
