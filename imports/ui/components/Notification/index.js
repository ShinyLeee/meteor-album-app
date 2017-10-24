import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { withStyles } from 'material-ui/styles';
import orange from 'material-ui/colors/orange';
import Chip from 'material-ui/Chip';
import DoneIcon from 'material-ui-icons/Done';
import FadeTransition from '/imports/ui/components/Transition/Fade';

class Notification extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.element,
    ]),
    onClick: PropTypes.func.isRequired,
    onIconClick: PropTypes.func,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    icon: false,
  }

  render() {
    const {
      visible,
      message,
      icon,
      classes,
      ...rest
    } = this.props;
    const deleteIcon = React.isValidElement(icon)
      ? icon
      : icon ? DoneIcon : undefined;
    return (
      <TransitionGroup className={classes.root}>
        {
          visible && (
            <FadeTransition>
              <Chip
                classes={{ root: classes.chip, deleteIcon: classes.deleteIcon }}
                label={message}
                onClick={this.props.onClick}
                deleteIcon={deleteIcon}
                onRequestDelete={deleteIcon ? this.props.onIconClick : undefined}
                {...rest}
              />
            </FadeTransition>
          )
        }
      </TransitionGroup>
    );
  }
}

const styles = {
  root: {
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },

  chip: {
    backgroundColor: orange[900],
    color: '#fff',
    '&:hover, &:focus': {
      backgroundColor: orange[800],
    },
  },

  deleteIcon: {
    color: '#fff',
    '&:hover, &:focus': {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
};

export default withStyles(styles)(Notification);
