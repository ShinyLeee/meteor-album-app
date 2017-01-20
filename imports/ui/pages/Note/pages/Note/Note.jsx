import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import { Notes } from '/imports/api/notes/note.js';
import { readNote, readAllNotes } from '/imports/api/notes/methods.js';
import scrollTo from '/imports/utils/scrollTo.js';
import { makeCancelable } from '/imports/utils/utils.js';

import Infinity from '/imports/ui/components/Infinity/Infinity.jsx';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import NoteHolder from '../../components/NoteHolder/NoteHolder.jsx';

export default class NotePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      isLoading: false,
      notes: props.initialNotes,
    };
    this.handleLoadNotes = this.handleLoadNotes.bind(this);
    this.handleReadNote = this.handleReadNote.bind(this);
    this.handleReadAll = this.handleReadAll.bind(this);
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

  handleLoadNotes() {
    const { limit } = this.props;
    const { notes } = this.state;
    const skip = notes.length;
    this.setState({ isLoading: true });
    const loadPromise = new Promise((resolve) => {
      Meteor.defer(() => {
        const newNotes = Notes.find(
          { isRead: { $ne: true } },
          { sort: { sendAt: -1 }, limit, skip }).fetch();
        const curNotes = [...notes, ...newNotes];
        this.setState({ notes: curNotes }, () => resolve());
      });
    });

    this.loadPromise = makeCancelable(loadPromise);
    this.loadPromise
      .promise
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch((err) => {
        throw new Meteor.Error(err);
      });
  }

  /**
   * call Meteor method and mark specific note is read.
   * @param {Object} e  - onTouchTap event object
   * @param {String} id - note id which has been read
   */
  handleReadNote(e, id) {
    e.preventDefault();
    readNote.call({ noteId: id }, (err) => {
      if (err) {
        this.props.snackBarOpen('发生未知错误');
        throw new Meteor.Error(err);
      }
      const trueNotes = Notes.find(
        { isRead: { $ne: true } },
        { sort: { sendAt: -1 }, limit: this.state.notes.length - 1 }
      ).fetch();
      this.setState({ notes: trueNotes });
    });
  }

  handleReadAll() {
    if (this.state.notes.length === 0) {
      this.props.snackBarOpen('您没有未读的信息');
      return;
    }
    this.setState({ isProcessing: true });
    readAllNotes.call({ receiver: this.props.User.username }, (err) => {
      if (err) {
        this.props.snackBarOpen('发生位置错误');
        throw new Meteor.Error(err);
      }
      this.setState({ isProcessing: false, notes: [] });
    });
  }

  renderContent() {
    if (this.state.notes.length === 0) return (<EmptyHolder mainInfo="您还未收到消息" />);
    return (
      <div className="content__note">
        <Infinity
          onInfinityLoad={this.handleLoadNotes}
          isLoading={this.state.isLoading}
          offsetToBottom={100}
        >
          {
            this.state.notes.map((note) => this.props.otherUsers.map((user) => note.sender === user.username &&
            (
              <NoteHolder
                sender={user}
                note={note}
                onReadNote={(e) => this.handleReadNote(e, note._id)}
              />
            )))
          }
        </Infinity>
      </div>
    );
  }

  render() {
    const { User, dataIsReady } = this.props;
    return (
      <div className="container">
        <NavHeader
          User={User}
          title="未读消息"
          onTitleTouchTap={() => scrollTo(0, 1500)}
          iconElementLeft={
            <IconButton onTouchTap={() => browserHistory.goBack()}>
              <ArrowBackIcon />
            </IconButton>
          }
          iconElementRight={
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <MenuItem
                primaryText="全部标记为已读"
                onTouchTap={this.handleReadAll}
              />
              <MenuItem
                primaryText="查看所有信息"
                onTouchTap={() => browserHistory.push(`/note/${User.username}/all`)}
              />
            </IconMenu>
          }
        />
        <div className="content">
          { this.state.isProcessing && (<Loading />) }
          { dataIsReady
            ? this.renderContent()
            : (<Loading />) }
        </div>
      </div>
    );
  }

}

NotePage.displayName = 'NotePage';

NotePage.propTypes = {
  User: PropTypes.object,
  dataIsReady: PropTypes.bool.isRequired,
  // Below Pass from database
  limit: PropTypes.number.isRequired,
  otherUsers: PropTypes.array.isRequired,
  initialNotes: PropTypes.array.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};