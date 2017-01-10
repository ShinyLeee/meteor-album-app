import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import scrollTo from '/imports/utils/scrollTo.js';
import { makeCancelable } from '/imports/utils/utils.js';
import { Notes } from '/imports/api/notes/note.js';
import { readAllNotes } from '/imports/api/notes/methods.js';
import Infinity from '/imports/ui/components/Infinity/Infinity.jsx';

import ConnectedNavHeader from '../../containers/NavHeaderContainer.jsx';
import NoteHolder from '../../components/Note/NoteHolder.jsx';

const styles = {
  indeterminateProgress: {
    position: 'fixed',
    backgroundColor: 'none',
    zIndex: 99,
  },
};

export default class NotePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      isLoading: false,
      notes: props.initialNotes,
    };
    this.handleReadAll = this.handleReadAll.bind(this);
    this.handleLoadNotes = this.handleLoadNotes.bind(this);
    this.handleRefreshNotes = this.handleRefreshNotes.bind(this);
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

  handleRefreshNotes() {
    // after read a note, we need to refresh the data
    const trueNotes = Notes.find(
      { isRead: { $ne: true } },
      { sort: { sendAt: -1 }, limit: this.state.notes.length - 1 }).fetch();
    this.setState({ notes: trueNotes });
  }

  renderNotes() {
    if (this.state.notes.length === 0) {
      return (
        <div className="Empty">
          <div className="Empty__container">
            <img
              className="Empty__logo"
              src={`${this.props.sourceDomain}/GalleryPlus/Default/empty.png`}
              role="presentation"
            />
            <h2 className="Empty__header">Oops!</h2>
            <p className="Empty__info">暂未收到新消息</p>
          </div>
        </div>
      );
    }
    return (
      <div className="note">
        <Infinity
          onInfinityLoad={this.handleLoadNotes}
          isLoading={this.state.isLoading}
          offsetToBottom={100}
        >
          {
            this.state.notes.map((note) => this.props.otherUsers.map((user) => note.sender === user.username &&
            (
              <NoteHolder
                User={this.props.User}
                sender={user}
                note={note}
                onReadNote={this.handleRefreshNotes}
              />
            )))
          }
        </Infinity>
      </div>
    );
  }

  renderLoader() {
    return (
      <div className="content text-center">
        <CircularProgress style={{ top: '150px' }} />
      </div>
    );
  }

  render() {
    const { User, dataIsReady } = this.props;
    return (
      <div className="container">
        <ConnectedNavHeader
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
          { this.state.isProcessing && <LinearProgress style={styles.indeterminateProgress} mode="indeterminate" /> }
          { dataIsReady ? this.renderNotes() : this.renderLoader() }
        </div>
      </div>
    );
  }

}

NotePage.defaultProps = {
  sourceDomain: Meteor.settings.public.sourceDomain,
};

NotePage.propTypes = {
  User: PropTypes.object,
  sourceDomain: PropTypes.string.isRequired,
  dataIsReady: PropTypes.bool.isRequired,
  // Below Pass from database
  limit: PropTypes.number.isRequired,
  otherUsers: PropTypes.array.isRequired,
  initialNotes: PropTypes.array.isRequired,
  // Below Pass from Redux
  snackBarOpen: PropTypes.func.isRequired,
};
