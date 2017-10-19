import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Notes } from '/imports/api/notes/note';
import { readNote } from '/imports/api/notes/methods';
import { makeCancelable } from '/imports/utils';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import Infinity from '/imports/ui/components/Infinity';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import NoteHolder from '/imports/ui/components/NoteHolder';

export default class NotesContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isLoading: false,
    notes: this.props.notes,
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (this.props.notes !== nextProps.notes) {
      this.setState({
        notes: nextProps.notes,
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

  render() {
    const { dataIsReady } = this.props;
    const isEmpty = this.state.notes.length === 0;
    return (
      <ContentLayout
        deep={!isEmpty}
        loading={!dataIsReady}
      >
        {
          dataIsReady && (
            <div className="content__note">
              {
                isEmpty
                ? <EmptyHolder mainInfo="您还未收到消息" />
                : (
                  <Infinity
                    onInfinityLoad={this._handleLoadNotes}
                    isLoading={this.state.isLoading}
                    offsetToBottom={100}
                  >
                    {
                      this.state.notes.map((note) => {
                        const sender = Meteor.users.findOne({ username: note.sender });
                        return (
                          <NoteHolder
                            key={note._id}
                            avatar={sender.profile.avatar}
                            note={note}
                            onRead={this._handleReadNote}
                          />
                        );
                      })
                    }
                  </Infinity>
                )
              }
            </div>
          )
        }
      </ContentLayout>
    );
  }
}
