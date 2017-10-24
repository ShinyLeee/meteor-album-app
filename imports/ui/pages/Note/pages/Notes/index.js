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
import ModalLoader from '/imports/ui/components/Modal/Common/ModalLoader';
import withLoadable from '/imports/ui/hocs/withLoadable';

const AsyncNoteContent = withLoadable({
  loader: () => import('./containers/ContentContainer'),
});

export default class NotesPage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    popover: false,
    popoverAnchor: undefined,
  }

  _navTo = (location) => () => {
    this.props.history.push(location);
  }

  _handleReadAll = async () => {
    const { User } = this.props;
    this.setState({ popover: false });
    try {
      await this.renderLoadModal('标记已读中');
      await readAllNotes.callPromise({ receiver: User.username });
      this.props.modalClose();
      this.props.snackBarOpen('标记已读成功');
    } catch (err) {
      console.log(err);
      this.props.modalClose();
      this.props.snackBarOpen(`标记已读失败 ${err.reason}`);
    }
  }

  renderPopover = (e) => {
    this.setState({ popover: true, popoverAnchor: e.currentTarget });
  }

  renderLoadModal = (message, errMsg = '请求超时') => new Promise((resolve) => {
    this.props.modalOpen({
      content: <ModalLoader message={message} errMsg={errMsg} />,
      ops: { ignoreBackdropClick: true },
    });
    setTimeout(() => resolve(), 275);
  })

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
