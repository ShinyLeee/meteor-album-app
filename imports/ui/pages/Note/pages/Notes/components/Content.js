import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Notes } from '/imports/api/notes/note';
import ContentLayout from '/imports/ui/layouts/ContentLayout';
import InfiniteNoteList from '/imports/ui/components/Infinity/NoteList';
import EmptyHolder from '/imports/ui/components/EmptyHolder';

export default class NotesContent extends Component {
  static propTypes = {
    dataIsReady: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    notesNum: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this._loadTimeout = null;
    this.state = {
      isLoading: false,
      notes: props.notes,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.dataIsReady && nextProps.dataIsReady) {
      this.setState({
        notes: nextProps.notes,
      });
    }
    // 只允许消息减少时更新notes状态 --> 因标记全部阅读
    if (
      this.props.dataIsReady && nextProps.dataIsReady &&
      this.props.notesNum > nextProps.notesNum
    ) {
      this.setState({
        notes: nextProps.notes,
      });
    }
  }

  componentWillUnmount() {
    if (this._loadTimeout) {
      clearTimeout(this._loadTimeout);
      this._loadTimeout = null;
    }
  }

  _handleInfiniteLoad = () => {
    this.setState({ isLoading: true });

    const { limit } = this.props;
    const { notes } = this.state;
    const skip = notes.length;

    this._loadTimeout = setTimeout(() => {
      const newNotes = Notes.find(
        { isRead: { $ne: true } },
        { sort: { sendAt: -1 }, limit, skip },
      ).fetch();
      this.setState((prevState) => ({
        isLoading: false,
        notes: [...prevState.notes, ...newNotes],
      }));
    }, 300);
  }

  render() {
    const { dataIsReady, notesNum } = this.props;
    const isEmpty = this.state.notes.length === 0;
    const isLoadAll = dataIsReady && this.state.notes.length === notesNum;
    return (
      <ContentLayout
        deep={!isEmpty}
        loading={!dataIsReady}
        delay
      >
        <div className="content__note">
          {
            isEmpty
            ? <EmptyHolder mainInfo="您还未收到消息" />
            : (
              <InfiniteNoteList
                key="Notes__InfiniteList"
                loading={this.state.isLoading}
                notes={this.state.notes}
                notesNum={notesNum}
                disabled={isLoadAll}
                onInfiniteLoad={this._handleInfiniteLoad}
                showActions
              />
            )
          }
        </div>
      </ContentLayout>
    );
  }
}
