import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { Notes } from '/imports/api/notes/note.js';
import { makeCancelable } from '/imports/utils/utils.js';
import Infinity from '/imports/ui/components/Infinity/Infinity.jsx';
import SecondaryNavHeader from '/imports/ui/components/NavHeader/Secondary/Secondary.jsx';
import EmptyHolder from '/imports/ui/components/EmptyHolder/EmptyHolder.jsx';
import Loading from '/imports/ui/components/Loader/Loading.jsx';
import BibleDialog from '/imports/ui/components/BibleDialog/BibleDialog.jsx';
import NoteHolder from '/imports/ui/components/NoteHolder/NoteHolder.jsx';

export default class AllNotesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      notes: props.initialAllNotes,
    };
    this.handleLoadNotes = this.handleLoadNotes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // When dataIsReady return true start setState
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({
        notes: nextProps.initialAllNotes,
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
          {},
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

  render() {
    const { dataIsReady, bibleDialogOpen, bible } = this.props;
    return (
      <div className="container">
        <SecondaryNavHeader title="全部消息" />
        <main className="content">
          {
            dataIsReady // eslint-disable-line no-nested-ternary
            ? this.state.notes.length === 0
              ? (<EmptyHolder mainInfo="您还未收到消息" />)
              : (
                <div className="content__allNotes">
                  <Infinity
                    onInfinityLoad={this.handleLoadNotes}
                    isLoading={this.state.isLoading}
                    offsetToBottom={100}
                  >
                    {
                      this.state.notes.map((note, i) => {
                        const senderObj = Meteor.users.findOne({ username: note.sender });
                        return (
                          <NoteHolder
                            key={i}
                            avatar={senderObj && senderObj.profile.avatar}
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
              )
            : (<Loading />)
          }
        </main>
      </div>
    );
  }

}

AllNotesPage.displayName = 'AllNotesPage';

AllNotesPage.propTypes = {
  User: PropTypes.object.isRequired,
  // Below Pass from Database and Redux
  dataIsReady: PropTypes.bool.isRequired,
  limit: PropTypes.number.isRequired,
  initialAllNotes: PropTypes.array.isRequired,
  bibleDialogOpen: PropTypes.bool.isRequired,
  bible: PropTypes.object, // only required when bibleDialogOpen true
};
