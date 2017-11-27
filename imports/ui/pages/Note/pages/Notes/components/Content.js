import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Notes } from '/imports/api/notes/note';
import ViewLayout from '/imports/ui/layouts/ViewLayout';
import InfiniteNoteList from '/imports/ui/components/Infinity/NoteList';
import EmptyHolder from '/imports/ui/components/EmptyHolder';

export default class NotesContent extends PureComponent {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    notesNum: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this._loadTimeout = null;
    this.state = {
      notes: props.notes,
    };
  }

  componentWillMount() {
    if (this.props.notesNum > 0) {
      ViewLayout.setRootBackgroundColor(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.notesNum !== nextProps.notesNum) {
      if (nextProps.notesNum === 0) {
        ViewLayout.setRootBackgroundColor(false);
      }
      if (nextProps.notesNum < this.props.notesNum) {
        this.setState({
          notes: nextProps.notes,
        });
      }
    }
  }

  componentWillUnmount() {
    if (this._loadTimeout) {
      clearTimeout(this._loadTimeout);
      this._loadTimeout = null;
    }
  }

  _handleInfiniteLoad = () => {
    const { limit } = this.props;
    const { notes } = this.state;
    const skip = notes.length;

    this._loadTimeout = setTimeout(() => {
      const newNotes = Notes.find(
        { isRead: { $ne: true } },
        { sort: { sendAt: -1 }, limit, skip },
      ).fetch();
      this.setState((prevState) => ({
        notes: [...prevState.notes, ...newNotes],
      }));
    }, 300);
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
          showActions
        />
      );
  }
}
