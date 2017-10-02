import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import IconButton from 'material-ui/IconButton';
import ReplyIcon from 'material-ui-icons/Reply';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import CheckBoxIcon from 'material-ui-icons/CheckBox';
import { QuillContent } from '/imports/ui/components/Quill';
import { Wrapper } from './NoteHolder.style.js';

const formatter = buildFormatter(CNStrings);

class NoteHolder extends Component {
  static propTypes = {
    isRead: PropTypes.bool.isRequired,
    avatar: PropTypes.string.isRequired,
    note: PropTypes.object.isRequired,
    onRead: PropTypes.func, // Not required bc AllNotePage do not need read notes
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isRead: false,
  }

  state = {
    expanded: true,
  }

  _handleRead = () => {
    const { note, onRead } = this.props;
    if (onRead) {
      onRead(note._id);
    }
  }

  _handleToggle = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  }

  render() {
    const { isRead, avatar, note, history, classes } = this.props;
    return (
      <Wrapper>
        <Card>
          <CardHeader
            avatar={<Avatar src={avatar} />}
            title={note.title}
            subheader={
              <div className={classes.subheader}>
                <TimeAgo date={note.sendAt} formatter={formatter} />
                <IconButton
                  className={classNames(classes.subheader__icon, {
                    [classes.subheader__icon_open]: this.state.expanded,
                  })}
                  onClick={this._handleToggle}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>
            }
          />
          <Collapse in={this.state.expanded} transitionDuration="auto">
            <QuillContent content={note.content} />
          </Collapse>
          {
            !isRead && (
              <CardActions className={classes.cardActions} disableActionSpacing>
                <IconButton
                  className={classes.cardActions__btn}
                  onClick={() => history.push(`/sendNote/?receiver=${note.receiver}`)}
                >
                  <ReplyIcon />
                </IconButton>
                <IconButton
                  className={classes.cardActions__btn}
                  onClick={this._handleRead}
                >
                  <CheckBoxIcon />
                </IconButton>
              </CardActions>
            )
          }
        </Card>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  subheader: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  subheader__icon: {
    position: 'absolute',
    top: -24,
    right: 0,
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },

  subheader__icon_open: {
    transform: 'rotate(180deg)',
  },

  cardActions: {
    justifyContent: 'flex-end',
  },

  cardActions__btn: {
    color: '#999',
  },
});

export default withRouter(
  withStyles(styles)(NoteHolder)
);
