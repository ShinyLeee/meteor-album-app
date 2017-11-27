import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { readAllNotes } from '/imports/api/notes/methods';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Modal from '/imports/ui/components/Modal';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncNoteContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class NotesPage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    popover: false,
    popoverAnchor: undefined,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.popover !== nextState.popover;
  }

  _navTo = (location) => () => {
    this.props.history.push(location);
  }

  _handleReadAll = async () => {
    const { User } = this.props;
    this.setState({ popover: false });
    try {
      await Modal.showLoader('标记已读中');
      await readAllNotes.callPromise({ receiver: User.username });
      Modal.close();
      this.props.snackBarOpen('标记已读成功');
    } catch (err) {
      console.warn(err);
      Modal.close();
      this.props.snackBarOpen(`标记已读失败 ${err.reason}`);
    }
  }

  renderPopover = (e) => {
    this.setState({ popover: true, popoverAnchor: e.currentTarget });
  }

  render() {
    const { User } = this.props;
    return (
      <ViewLayout
        Topbar={
          <SecondaryNavHeader
            title="未读消息"
            Right={
              <IconButton
                color="contrast"
                onClick={this.renderPopover}
              ><MoreVertIcon />
              </IconButton>
            }
          />
        }
      >
        <AsyncNoteContent />
        <Popover
          open={this.state.popover}
          anchorEl={this.state.popoverAnchor}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={() => this.setState({ popover: false })}
        >
          <List>
            <ListItem onClick={this._handleReadAll}>
              <ListItemText primary="全部标记为已读" />
            </ListItem>
            <ListItem onClick={this._navTo(`/note/${User.username}/sent`)}>
              <ListItemText primary="我发出的全部信息" />
            </ListItem>
            <ListItem onClick={this._navTo(`/note/${User.username}/received`)}>
              <ListItemText primary="我收到的全部信息" />
            </ListItem>
          </List>
        </Popover>
      </ViewLayout>
    );
  }
}
