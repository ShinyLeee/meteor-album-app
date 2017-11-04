import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TimeAgo from 'react-timeago';
import CNStrings from 'react-timeago/lib/language-strings/zh-CN';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Avatar from 'material-ui/Avatar';
import Card, { CardHeader, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import IconButton from 'material-ui/IconButton';
import ReplyIcon from 'material-ui-icons/Reply';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import CheckBoxIcon from 'material-ui-icons/CheckBox';
import QuillContent from '/imports/ui/components/Quill/QuillContent';
import { Wrapper } from './NoteHolder.style';

const formatter = buildFormatter(CNStrings);

export default class NoteHolder extends PureComponent {
  static propTypes = {
    note: PropTypes.object.isRequired,
    sender: PropTypes.object.isRequired,
    showActions: PropTypes.bool,
    onRead: PropTypes.func, // Not required bc AllNotePage do not need read notes
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    showActions: false,
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
    const {
      note,
      sender,
      showActions,
      history,
      classes,
    } = this.props;
    return (
      <Wrapper>
        <Card>
          <CardHeader
            avatar={<Avatar src={sender.profile.avatar} />}
            title={note.title}
            subheader={
              <div className={classes.subheader}>
                <TimeAgo date={note.sendAt} formatter={formatter} />
                <IconButton
                  className={classNames(classes.subheader__icon, {
                    [classes.subheader__icon_open]: this.state.expanded,
                  })}
                  onClick={this._handleToggle}
                ><ExpandMoreIcon />
                </IconButton>
              </div>
            }
          />
          <Collapse in={this.state.expanded} transitionDuration="auto">
            <QuillContent content={note.content} />
          </Collapse>
          {
            showActions && (
              <CardActions className={classes.cardActions} disableActionSpacing>
                <IconButton
                  className={classes.cardActions__btn}
                  onClick={() => history.push(`/sendNote/?receiver=${note.receiver}`)}
                ><ReplyIcon />
                </IconButton>
                <IconButton
                  className={classes.cardActions__btn}
                  onClick={this._handleRead}
                ><CheckBoxIcon />
                </IconButton>
              </CardActions>
            )
          }
        </Card>
      </Wrapper>
    );
  }
}
