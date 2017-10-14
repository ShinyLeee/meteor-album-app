import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import List, {
  ListItem,
  ListItemText,
} from 'material-ui/List';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import purple from 'material-ui/colors/purple';
import { Notes } from '/imports/api/notes/note.js';
import { readNote, readAllNotes } from '/imports/api/notes/methods.js';
import { makeCancelable } from '/imports/utils';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import { SecondaryNavHeader } from '/imports/ui/components/NavHeader';
import Infinity from '/imports/ui/components/Infinity';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import { LinearLoader } from '/imports/ui/components/Loader';
import NoteHolder from '/imports/ui/components/NoteHolder';

const purple500 = purple[500];

export default class NotePage extends Component {
  static propTypes = {
    User: PropTypes.object.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    initialNotes: PropTypes.array.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    popover: false,
    popoverAnchor: undefined,
    isProcessing: false,
    isLoading: false,
    notes: this.props.initialNotes,
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({
        notes: nextProps.initialNotes,
      });
    }
  }

  componentWillUnmount() {
    // If lifecyle is in componentWillUnmount,
    // But if promise still in progress then Cancel the promise
    if (this.loadPromise) {
      this.loadPromise.cancel();
    }
  }

  _handleLoadNotes = () => {
    const { limit } = this.props;
    const skip = this.statenotes.length;
    this.setState({ isLoading: true });
    const loadPromise = new Promise((resolve) => {
      Meteor.defer(() => {
        const newNotes = Notes.find(
          { isRead: { $ne: true } },
          { sort: { sendAt: -1 }, limit, skip }).fetch();
        const curNotes = [...this.state.notes, ...newNotes];
        this.setState({ notes: curNotes }, () => resolve());
      });
    });

    this.loadPromise = makeCancelable(loadPromise);
    this.loadPromise.promise
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.props.snackBarOpen(`加载信息失败 ${err.reason}`);
      });
  }

  /**
   * call Meteor method and mark specific note is read.
   * @param {String} id - note id which has been read
   */
  _handleReadNote = (id) => {
    readNote.callPromise({ noteId: id })
      .then(() => {
        const trueNotes = Notes.find(
          { isRead: { $ne: true } },
          { sort: { sendAt: -1 }, limit: this.state.notes.length - 1 },
        ).fetch();
        this.setState({ notes: trueNotes });
      })
      .catch((err) => {
        console.log(err);
        this.props.snackBarOpen(`标记已读失败 ${err.reason}`);
      });
  }

  _handleReadAll = () => {
    const { User } = this.props;
    if (this.state.notes.length === 0) {
      this.props.snackBarOpen('您没有未读的信息');
      return;
    }
    this.setState({ isProcessing: true });
    readAllNotes.callPromise({ receiver: User.username })
      .then(() => {
        this.setState({ isProcessing: false, notes: [] });
      })
      .catch((err) => {
        console.log(err);
        this.props.snackBarOpen(`标记已读失败 ${err.reason}`);
      });
  }

  _handleOpenPopover = (e) => {
    this.setState({ popover: true, popoverAnchor: e.currentTarget });
  }

  renderContent() {
    if (this.state.notes.length === 0) {
      return <EmptyHolder mainInfo="您还未收到消息" />;
    }
    return (
      <div className="content__note">
        <Infinity
          onInfinityLoad={this._handleLoadNotes}
          isLoading={this.state.isLoading}
          offsetToBottom={100}
        >
          {
            this.state.notes.map((note) => {
              const senderObj = Meteor.users.findOne({ username: note.sender });
              return (
                <NoteHolder
                  key={note._id}
                  avatar={senderObj.profile.avatar}
                  note={note}
                  onRead={this._handleReadNote}
                />
              );
            })
          }
        </Infinity>
      </div>
    );
  }

  render() {
    const { dataIsReady, User, history } = this.props;
    return (
      <ViewLayout
        deep={this.state.notes.length !== 0}
        Topbar={
          <SecondaryNavHeader
            title="未读消息"
            style={{ backgroundColor: purple500 }}
            Right={
              <IconButton
                color="contrast"
                onClick={this._handleOpenPopover}
              >
                <MoreVertIcon />
              </IconButton>
            }
          />
        }
      >
        { this.state.isProcessing && (<LinearLoader />) }
        { dataIsReady && this.renderContent() }
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
            <ListItem onClick={() => history.push(`/note/${User.username}/sent`)}>
              <ListItemText primary="我发出的全部信息" />
            </ListItem>
            <ListItem onClick={() => history.push(`/note/${User.username}/received`)}>
              <ListItemText primary="我收到的全部信息" />
            </ListItem>
          </List>
        </Popover>
      </ViewLayout>
    );
  }
}
