import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { blue500 } from 'material-ui/styles/colors';
import { Notes } from '/imports/api/notes/note.js';
import { makeCancelable } from '/imports/utils/utils.js';

import Infinity from '/imports/ui/components/Infinity/Infinity.jsx';
import NavHeader from '/imports/ui/components/NavHeader/NavHeader.jsx';
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

  renderContent() {
    const { bibleDialogOpen, bible } = this.props;
    const { notes } = this.state;
    if (notes.length === 0) return (<EmptyHolder mainInfo="您还未收到消息" />);
    return (
      <div className="content__allNotes">
        <Infinity
          onInfinityLoad={this.handleLoadNotes}
          isLoading={this.state.isLoading}
          offsetToBottom={100}
        >
          {
            notes.map((note, i) => {
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
    );
  }

  render() {
    return (
      <div className="container">
        <NavHeader title="全部消息" style={{ backgroundColor: blue500 }} secondary />
        <div className="content">
          {
            this.props.dataIsReady
            ? this.renderContent()
            : (<Loading />)
          }
        </div>
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
