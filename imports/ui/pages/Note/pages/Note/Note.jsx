import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { purple500 } from 'material-ui/styles/colors.js';
import { Notes } from '/imports/api/notes/note.js';
import { readNote, readAllNotes } from '/imports/api/notes/methods.js';
import { makeCancelable } from '/imports/utils';
import Infinity from '/imports/ui/components/Infinity/Infinity.jsx';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import BibleDialog from '/imports/ui/components/BibleDialog/BibleDialog.jsx';
import NoteHolder from '/imports/ui/components/NoteHolder/NoteHolder.jsx';

export default class NotePage extends Component {
  static propTypes = {
    // Below Pass from Database and Redux
    User: PropTypes.object.isRequired,
    dataIsReady: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    initialNotes: PropTypes.array.isRequired,
    bibleDialogOpen: PropTypes.bool.isRequired,
    bible: PropTypes.object, // only required when bibleDialogOpen true
    snackBarOpen: PropTypes.func.isRequired,
    // Below Pass from React-Router
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      isLoading: false,
      notes: props.initialNotes,
    };
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
    this.loadPromise.promise
    .then(() => {
      this.setState({ isLoading: false });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  /**
   * call Meteor method and mark specific note is read.
   * @param {Object} e  - onTouchTap event object
   * @param {String} id - note id which has been read
   */
  _handleReadNote = (e, id) => {
    e.preventDefault();
    readNote.callPromise({ noteId: id })
    .then(() => {
      const trueNotes = Notes.find(
        { isRead: { $ne: true } },
        { sort: { sendAt: -1 }, limit: this.state.notes.length - 1 }
      ).fetch();
      this.setState({ notes: trueNotes });
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(err.reason || '发生未知错误');
    });
  }

  _handleReadAll = () => {
    if (this.state.notes.length === 0) {
      this.props.snackBarOpen('您没有未读的信息');
      return;
    }
    this.setState({ isProcessing: true });
    readAllNotes.callPromise({ receiver: this.props.User.username })
    .then(() => {
      this.setState({ isProcessing: false, notes: [] });
    })
    .catch((err) => {
      console.log(err);
      this.props.snackBarOpen(err.reason || '发生未知错误');
    });
  }

  render() {
    const {
      dataIsReady,
      User,
      bibleDialogOpen,
      bible,
      history,
    } = this.props;
    return (
      <div className="container">
        <SecondaryNavHeader
          title="未读消息"
          style={{ backgroundColor: purple500 }}
          iconElementRight={
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              <MenuItem
                primaryText="全部标记为已读"
                onTouchTap={this._handleReadAll}
              />
              <MenuItem
                primaryText="我发出的所有信息"
                onTouchTap={() => history.push(`/note/${User.username}/sent`)}
              />
              <MenuItem
                primaryText="我收到的所有信息"
                onTouchTap={() => history.push(`/note/${User.username}/received`)}
              />
            </IconMenu>
          }
        />
        <main className="content">
          { this.state.isProcessing && (<Loading />) }
          {
            dataIsReady // eslint-disable-line no-nested-ternary
            ? this.state.notes.length === 0
              ? (<EmptyHolder mainInfo="您还未收到消息" />)
              : (
                <div className="content__note">
                  <Infinity
                    onInfinityLoad={this._handleLoadNotes}
                    isLoading={this.state.isLoading}
                    offsetToBottom={100}
                  >
                    {
                      this.state.notes.map((note, i) => {
                        const senderObj = Meteor.users.findOne({ username: note.sender });
                        return (
                          <NoteHolder
                            key={i}
                            avatar={senderObj.profile.avatar}
                            note={note}
                            onReadBtnClick={(e) => this._handleReadNote(e, note._id)}
                          />
                        );
                      })
                    }
                  </Infinity>
                  <BibleDialog
                    open={bibleDialogOpen}
                    bible={bible}
                  />
                </div>
              )
            : (<Loading />)
          }
        </main>
      </div>
    );
  }

}
