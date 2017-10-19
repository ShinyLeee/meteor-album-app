import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Notes } from '/imports/api/notes/note';
import { makeCancelable } from '/imports/utils';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import Infinity from '/imports/ui/components/Infinity';
import NoteHolder from '/imports/ui/components/NoteHolder';

export default class AllNotesContent extends Component {
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
    const { notes } = this.state;
    const skip = notes.length;
    this.setState({ isLoading: true });
    const loadPromise = new Promise((resolve) => {
      Meteor.defer(() => {
        const newNotes = Notes.find({}, {
          sort: { sendAt: -1 },
          limit,
          skip,
        }).fetch();
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
        this.props.snackBarOpen(`加载信息失败 ${err.reason}`);
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
            <div className="content__allNotes">
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
                            avatar={sender && sender.profile.avatar}
                            note={note}
                            isRead
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
