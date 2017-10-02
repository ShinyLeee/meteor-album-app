import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Notes } from '/imports/api/notes/note.js';
import { makeCancelable } from '/imports/utils';
import RootLayout from '/imports/ui/layouts/RootLayout';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary';
import Infinity from '/imports/ui/components/Infinity';
import EmptyHolder from '/imports/ui/components/EmptyHolder';
import BibleDialog from '/imports/ui/components/BibleDialog';
import NoteHolder from '/imports/ui/components/NoteHolder';

export default class AllSentNotesPage extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    initialAllSentNotes: PropTypes.array.isRequired,
    bibleDialogOpen: PropTypes.bool.isRequired,
    bible: PropTypes.object, // only required when bibleDialogOpen true
    snackBarOpen: PropTypes.func.isRequired,
  }

  state = {
    isLoading: false,
    notes: this.props.initialAllSentNotes,
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({
        notes: nextProps.initialAllSentNotes,
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

  renderContent() {
    const { bibleDialogOpen, bible } = this.props;
    if (this.state.notes.length === 0) {
      return <EmptyHolder mainInfo="您还未发送过消息" />;
    }
    return (
      <div className="content__allSentNotes">
        <Infinity
          onInfinityLoad={this._handleLoadNotes}
          isLoading={this.state.isLoading}
          offsetToBottom={100}
        >
          {
            this.state.notes.map((note, i) => {
              const receiverObj = Meteor.users.findOne({ username: note.receiver });
              return (
                <NoteHolder
                  key={i}
                  avatar={receiverObj && receiverObj.profile.avatar}
                  note={note}
                  isRead
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
    );
  }

  render() {
    const { dataIsReady } = this.props;
    return (
      <RootLayout
        deep={this.state.notes.length !== 0}
        loading={!dataIsReady}
        Topbar={<SecondaryNavHeader title="我发出的全部消息" />}
      >
        { dataIsReady && this.renderContent() }
      </RootLayout>
    );
  }

}
