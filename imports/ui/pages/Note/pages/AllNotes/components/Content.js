import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Notes } from '/imports/api/notes/note';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import InfiniteNoteList from '/imports/ui/components/Infinity/NoteList';
import EmptyHolder from '/imports/ui/components/EmptyHolder';

export default class AllNotesContent extends PureComponent {
  static propTypes = {
    User: PropTypes.object.isRequired,
    limit: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    notesNum: PropTypes.number.isRequired,
  }

  state = {
    notes: this.props.notes,
  }

  componentWillMount() {
    if (this.props.notesNum > 0) {
      ViewLayout.setRootBackgroundColor(true); // set deep BackgroundColor
    }
  }

  _handleInfiniteLoad = () => {
    const { User, limit } = this.props;
    const skip = this.state.notes.length;

    const newNotes = Notes.find(
      { receiver: User.username },
      { sort: { sendAt: -1 }, limit, skip },
    ).fetch();
    this.setState((prevState) => ({
      notes: [...prevState.notes, ...newNotes],
    }));
  }

  render() {
    const { notesNum } = this.props;
    const isLoadAll = this.state.notes.length === notesNum;
    return notesNum === 0
      ? <EmptyHolder mainInfo="您还未收到消息" />
      : (
        <InfiniteNoteList
          notes={this.state.notes}
          notesNum={notesNum}
          disabled={isLoadAll}
          onInfiniteLoad={this._handleInfiniteLoad}
        />
      );
  }
}
